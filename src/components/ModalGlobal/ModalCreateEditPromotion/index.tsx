import { useEffect, useMemo, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import { Col, Row } from "antd";
import ModalGlobal from "..";
import ApiPromotion, { IPromotionRes } from "@/api/ApiPromotion";
import Upload, { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  DatePickerFormikGlobal,
  FormItemGlobal,
  InputFormikGlobal,
  InputNumberFormikGlobal,
} from "@/components/FormGlobal";
import moment, { Moment } from "moment";
import { PromotionValidation } from "@/utils/validation/promotion";

interface ICreatePromotionBody {
  name: string;
  description: string;
  startDate: Moment;
  endDate: Moment;
  discount: number;
  file?: RcFile[];
}

interface IModalCreateEditPromotion {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  selectedPromotion?: IPromotionRes;
}

export default function ModalCreateEditPromotion({
  isOpenModal,
  handleCloseModal,
  selectedPromotion,
}: IModalCreateEditPromotion) {
  const [files, setFiles] = useState<UploadFile<RcFile>[]>([]);

  const innerRef = useRef<FormikProps<ICreatePromotionBody>>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedPromotion?.image) {
      const urlSplit = selectedPromotion?.image.split("/");
      const fileName = urlSplit[urlSplit.length - 1];
      const tempArray: UploadFile<RcFile> = {
        uid: "initial",
        name: fileName ?? "file name",
        status: "done",
        url: selectedPromotion?.image,
      };
      setFiles([tempArray]);
    } else {
      setFiles([]);
    }
  }, [selectedPromotion]);

  const initialValues: ICreatePromotionBody = useMemo(() => {
    return {
      name: selectedPromotion?.name ?? "",
      description: selectedPromotion?.description ?? "",
      startDate: selectedPromotion?.startDate
        ? moment(selectedPromotion?.startDate)
        : moment(),
      endDate: selectedPromotion?.startDate
        ? moment(selectedPromotion?.endDate)
        : moment(),
      discount: selectedPromotion?.discount ?? 0,
      file: undefined,
    };
  }, [selectedPromotion]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };

  const createPromotionMutation = useMutation(ApiPromotion.createPromotion);
  const updatePromotionMutation = useMutation(ApiPromotion.updatePromotion);
  const handleSubmit = async (values: ICreatePromotionBody) => {
    const newValues = {
      ...values,
      startDate: moment(values.startDate).format("YYYY-MM-DD"),
      endDate: moment(values.endDate).format("YYYY-MM-DD"),
    };
    const formData = new FormData();
    Object.entries(newValues).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string);
      }
    });

    if (selectedPromotion) {
      formData.append("id", selectedPromotion.id);
      updatePromotionMutation.mutate(formData, {
        onSuccess: () => {
          Notification.notificationSuccess("Thành công");
          queryClient.refetchQueries(["get_promotions"]);
          onCancel();
        },
      });
      return;
    }
    createPromotionMutation.mutate(formData, {
      onSuccess: () => {
        Notification.notificationSuccess("Thành công");
        queryClient.refetchQueries(["get_promotions"]);
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
      validationSchema={PromotionValidation(
        selectedPromotion ? "edit" : "create"
      )}
    >
      {({ handleSubmit, setFieldValue, values }): JSX.Element => {
        const onChange = (info: UploadChangeParam<UploadFile<RcFile>>) => {
          setFiles(info.fileList);
          setFieldValue("file", info.fileList[0].originFileObj);
        };

        return (
          <ModalGlobal
            open={isOpenModal}
            title={
              selectedPromotion ? "Sửa thông tin khuyến mại" : "Tạo khuyến mại"
            }
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={
              createPromotionMutation.isLoading ||
              updatePromotionMutation.isLoading
            }
            width={1000}
          >
            <FormGlobal>
              <Row gutter={[8, 0]}>
                <Col span={12}>
                  <FormItemGlobal name="name" label="Tên khuyến mại" required>
                    <InputFormikGlobal
                      name="name"
                      placeholder="Tên khuyến mại"
                    />
                  </FormItemGlobal>
                  <FormItemGlobal
                    name="startDate"
                    label="Ngày bắt đầu"
                    required
                  >
                    <DatePickerFormikGlobal
                      name="startDate"
                      placeholder="Ngày bắt đầu"
                      allowClear={false}
                      disabledDate={(d) =>
                        d <= moment().subtract(1, "days") || d >= values.endDate
                      }
                    />
                  </FormItemGlobal>
                  <FormItemGlobal name="discount" label="Discount" required>
                    <InputNumberFormikGlobal
                      name="discount"
                      placeholder="Discount"
                      min={0}
                    />
                  </FormItemGlobal>
                </Col>
                <Col span={12}>
                  <FormItemGlobal name="description" label="Mô tả">
                    <InputFormikGlobal name="description" placeholder="Mô tả" />
                  </FormItemGlobal>
                  <FormItemGlobal name="endDate" label="Ngày kết thúc" required>
                    <DatePickerFormikGlobal
                      name="endDate"
                      placeholder="Ngày kết thúc"
                      allowClear={false}
                      disabledDate={(d) => d <= values.startDate}
                    />
                  </FormItemGlobal>
                </Col>
              </Row>
              <FormItemGlobal
                name="file"
                label="Ảnh minh họa"
                required={!selectedPromotion}
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
