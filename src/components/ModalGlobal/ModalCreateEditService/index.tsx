import { useEffect, useMemo, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import { Col, Row } from "antd";
import ModalGlobal from "..";
import ApiService, { IServiceRes } from "@/api/ApiService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  FormItemGlobal,
  InputFormikGlobal,
  InputNumberFormikGlobal,
} from "@/components/FormGlobal";
import { ServiceValidation } from "@/utils/validation/service";
import Upload, { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload";

interface IModalCreateEditService {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  selectedService?: IServiceRes;
}

interface ICreateServiceBody {
  name: string;
  description: string;
  price: number;
  unity: string;
  image?: string | null;
  file?: RcFile[];
}

export default function ModalCreateEditService({
  isOpenModal,
  handleCloseModal,
  selectedService,
}: IModalCreateEditService) {
  const [files, setFiles] = useState<UploadFile<RcFile>[]>([]);

  const innerRef = useRef<FormikProps<ICreateServiceBody>>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedService?.image) {
      const urlSplit = selectedService?.image.split("/");
      const fileName = urlSplit[urlSplit.length - 1];
      const tempArray: UploadFile<RcFile> = {
        uid: "initial",
        name: fileName ?? "file name",
        status: "done",
        url: selectedService?.image,
      };
      setFiles([tempArray]);
    } else {
      setFiles([]);
    }
  }, [selectedService]);

  const initialValues: ICreateServiceBody = useMemo(() => {
    return {
      name: selectedService?.name ?? "",
      unity: selectedService?.unity ?? "",
      description: selectedService?.description ?? "",
      price: selectedService?.price ?? 0,
      file: undefined,
    };
  }, [selectedService]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };

  const createServiceMutation = useMutation(ApiService.createService);
  const updateServiceMutation = useMutation(ApiService.updateService);
  const handleSubmit = async (values: ICreateServiceBody) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string);
      }
    });
    files.length > 0 &&
      !values.file &&
      formData.append("image", selectedService?.image as string);

    if (selectedService) {
      updateServiceMutation.mutate(
        { id: +selectedService.id, data: formData },
        {
          onSuccess: () => {
            Notification.notificationSuccess("Thành công");
            queryClient.refetchQueries(["get_services"]);
            onCancel();
          },
        }
      );
      return;
    }
    createServiceMutation.mutate(formData, {
      onSuccess: () => {
        Notification.notificationSuccess("Thành công");
        queryClient.refetchQueries(["get_services"]);
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
      validationSchema={ServiceValidation(selectedService ? "edit" : "create")}
    >
      {({ handleSubmit, setFieldValue }): JSX.Element => {
        const onChange = (info: UploadChangeParam<UploadFile<RcFile>>) => {
          setFiles(info.fileList);
          setFieldValue("file", info.fileList[0].originFileObj);
        };

        return (
          <ModalGlobal
            open={isOpenModal}
            title={selectedService ? "Sửa thông tin dịch vụ" : "Tạo dịch vụ"}
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={
              createServiceMutation.isLoading || updateServiceMutation.isLoading
            }
            width={1000}
          >
            <FormGlobal>
              <Row gutter={[8, 0]}>
                <Col span={12}>
                  <FormItemGlobal name="name" label="Tên dịch vụ" required>
                    <InputFormikGlobal name="name" placeholder="Tên dịch vụ" />
                  </FormItemGlobal>
                  <FormItemGlobal
                    name="price"
                    label="Giá dịch vụ (vnđ)"
                    required
                  >
                    <InputNumberFormikGlobal
                      name="price"
                      placeholder="Giá dịch vụ (vnđ)"
                      min={0}
                    />
                  </FormItemGlobal>
                </Col>
                <Col span={12}>
                  <FormItemGlobal name="description" label="Mô tả">
                    <InputFormikGlobal name="description" placeholder="Mô tả" />
                  </FormItemGlobal>
                  <FormItemGlobal name="unity" label="Đơn vị">
                    <InputFormikGlobal name="unity" placeholder="Đơn vị" />
                  </FormItemGlobal>
                </Col>
              </Row>
              <FormItemGlobal
                name="file"
                label="Ảnh minh họa"
                required={!selectedService}
              >
                <Upload
                  name="file"
                  listType="picture-card"
                  accept=".png,.jpg,.jpeg"
                  fileList={files}
                  beforeUpload={() => false}
                  onChange={onChange}
                >
                  {files.length < 1 && "Upload"}
                </Upload>
              </FormItemGlobal>
            </FormGlobal>
          </ModalGlobal>
        );
      }}
    </Formik>
  );
}
