import { useEffect, useMemo, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import { Col, Row } from "antd";
import ModalGlobal from "..";
import ApiRoom, { IRoomRes } from "@/api/ApiRoom";
import Upload, { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  FormItemGlobal,
  InputFormikGlobal,
  InputNumberFormikGlobal,
  SelectFormikGlobal,
} from "@/components/FormGlobal";
import { RoomValidation } from "@/utils/validation/room";
import ApiRoomFeature from "@/api/ApiRoomFeature";

interface ICreateRomeBody {
  name: string;
  price: number;
  description: string;
  feature_rooms: number[];
  files: RcFile[];
}

interface IModalCreateEditRoom {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  roomSelected?: IRoomRes;
}

export default function ModalCreateEditRoom({
  isOpenModal,
  handleCloseModal,
  roomSelected,
}: IModalCreateEditRoom) {
  const [files, setFiles] = useState<UploadFile<RcFile>[]>([]);

  const innerRef = useRef<FormikProps<ICreateRomeBody>>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (roomSelected?.images) {
      const tempArray: UploadFile<RcFile>[] = [];
      roomSelected?.images.forEach((item, i) => {
        const urlSplit = item.split("/");
        const fileName = urlSplit[urlSplit.length - 1];
        tempArray.push({
          uid: `initial_${i}`,
          name: fileName ?? "file name",
          status: "done",
          url: item,
        });
      });
      setFiles(tempArray);
    } else {
      setFiles([]);
    }
  }, [roomSelected]);

  const initialValues: ICreateRomeBody = useMemo(() => {
    return {
      name: roomSelected?.name ?? "",
      price: roomSelected?.price ?? 0,
      description: roomSelected?.description ?? "",
      feature_rooms: roomSelected?.feature_rooms?.map((item) => item.id) ?? [],
      files: [],
    };
  }, [roomSelected]);

  const { data: roomFeatures } = useQuery(["get_room_features"], () =>
    ApiRoomFeature.getRoomFeatures()
  );

  const convertRoomFeatures = useMemo(() => {
    return roomFeatures?.results.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }, [roomFeatures]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };

  const createRoomMutation = useMutation(ApiRoom.createRoom);
  const updateRoomMutation = useMutation(ApiRoom.updateRoom);
  const handleSubmit = async (values: ICreateRomeBody) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "files") {
        formData.append(key, value);
      } else {
        values.files.forEach((item) => formData.append(key, item));
      }
    });

    const newImage: string[] = files
      .filter((item) => item.uid.startsWith("initial"))
      .map((item) => item.url as string);

    newImage?.length > 0 && formData.append("images", newImage.toString());

    if (roomSelected) {
      updateRoomMutation.mutate(
        { id: +roomSelected.id, formData },
        {
          onSuccess: () => {
            Notification.notificationSuccess("Thành công");
            queryClient.refetchQueries(["get_rooms"]);
            onCancel();
          },
        }
      );
      return;
    }
    createRoomMutation.mutate(formData, {
      onSuccess: () => {
        Notification.notificationSuccess("Thành công");
        queryClient.refetchQueries(["get_rooms"]);
        onCancel();
      },
    });
  };

  return (
    <Formik
      innerRef={innerRef}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
      validationSchema={RoomValidation(roomSelected ? "edit" : "create")}
    >
      {({ handleSubmit, values, setFieldValue }): JSX.Element => {
        const onChange = (info: UploadChangeParam<UploadFile<RcFile>>) => {
          setFiles(info.fileList);
          setFieldValue("files", [
            ...values.files,
            ...info.fileList
              .filter((item) => !item.uid.startsWith("initial"))
              .map((item) => item.originFileObj),
          ]);
        };

        const onRemove = (file: UploadFile<RcFile>) => {
          setFiles(files.filter((item) => item.uid !== file.uid));
        };

        return (
          <ModalGlobal
            open={isOpenModal}
            title={roomSelected ? "Sửa thông tin phòng" : "Tạo phòng"}
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={
              createRoomMutation.isLoading || updateRoomMutation.isLoading
            }
            width={1000}
          >
            <FormGlobal>
              <Row gutter={[8, 0]}>
                <Col span={12}>
                  <FormItemGlobal name="name" label="Tên phòng" required>
                    <InputFormikGlobal name="name" placeholder="Tên phòng" />
                  </FormItemGlobal>
                  <FormItemGlobal name="price" label="Giá phòng (vnđ)">
                    <InputNumberFormikGlobal
                      name="price"
                      placeholder="Giá phòng (vnđ)"
                      min={0}
                    />
                  </FormItemGlobal>
                </Col>
                <Col span={12}>
                  <FormItemGlobal name="description" label="Mô tả">
                    <InputFormikGlobal name="description" placeholder="Mô tả" />
                  </FormItemGlobal>
                  <FormItemGlobal name="feature_rooms" label="Tiện nghi">
                    <SelectFormikGlobal
                      name="feature_rooms"
                      mode="multiple"
                      placeholder="Tiện nghi"
                      options={convertRoomFeatures}
                    />
                  </FormItemGlobal>
                </Col>
              </Row>
              <FormItemGlobal
                name="files"
                label="Ảnh minh họa"
                required={!roomSelected}
              >
                <Upload
                  name="files"
                  listType="picture-card"
                  accept=".png,.jpg,.jpeg"
                  fileList={files}
                  beforeUpload={() => false}
                  onChange={onChange}
                  onRemove={onRemove}
                  multiple={true}
                >
                  {values.files.length < 5 && "Upload"}
                </Upload>
              </FormItemGlobal>
            </FormGlobal>
          </ModalGlobal>
        );
      }}
    </Formik>
  );
}
