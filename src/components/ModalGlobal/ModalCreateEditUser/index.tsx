import { useMemo, useRef } from "react";
import { Formik, FormikProps } from "formik";
import { Col, Row } from "antd";
import ModalGlobal from "..";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  FormItemGlobal,
  InputFormikGlobal,
  InputPasswordFormikGlobal,
  SelectFormikGlobal,
} from "@/components/FormGlobal";
import ApiUser, { ICreateUser, ILoginRes } from "@/api/ApiUser";
import { UserValidation } from "@/utils/validation/user";

interface IModalCreateEditUser {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  selectedUser?: ILoginRes;
}

interface ICreateUserBody {
  username: string;
  email: string;
  role?: "ROLE_ADMIN" | "ROLE_RECEPTIONIST" | "ROLE_ACCOUNTANT";
  password: string;
}

export default function ModalCreateEditUser({
  isOpenModal,
  handleCloseModal,
  selectedUser,
}: IModalCreateEditUser) {
  const innerRef = useRef<FormikProps<ICreateUserBody>>(null);
  const queryClient = useQueryClient();

  const initialValues: any = useMemo(() => {
    return {
      username: selectedUser?.username ?? "",
      email: selectedUser?.email ?? "",
      role: selectedUser?.role ?? "",
      password: selectedUser?.password ?? "",
    };
  }, [selectedUser]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };

  const createUserMutation = useMutation(ApiUser.createUser);
  const updateUserMutation = useMutation(ApiUser.updateUser);

  const handleSubmit = async (values: ICreateUserBody) => {
    if (selectedUser) {
      updateUserMutation.mutate(
        { id: selectedUser.id, data: values },
        {
          onSuccess: () => {
            Notification.notificationSuccess("Thành công");
            queryClient.refetchQueries(["get_users"]);
            onCancel();
          },
        }
      );
      return;
    }

    createUserMutation.mutate(values as ICreateUser, {
      onSuccess: () => {
        Notification.notificationSuccess("Thêm nhân viên thành công");
        queryClient.refetchQueries(["get_users"]);
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
      validationSchema={UserValidation}
    >
      {({ handleSubmit, setFieldValue }): JSX.Element => {
        return (
          <ModalGlobal
            open={isOpenModal}
            title={selectedUser ? "Sửa thông tin nhân viên" : "Tạo nhân viên"}
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={
              createUserMutation.isLoading || updateUserMutation.isLoading
            }
            width={1000}
          >
            <FormGlobal>
              <Row gutter={[8, 0]}>
                <Col span={12}>
                  <FormItemGlobal
                    name="username"
                    label="Tên nhân viên"
                    required
                  >
                    <InputFormikGlobal
                      name="username"
                      placeholder="Tên nhân viên"
                    />
                  </FormItemGlobal>
                  <FormItemGlobal name="email" label="Email" required>
                    <InputFormikGlobal name="email" placeholder="email" />
                  </FormItemGlobal>
                </Col>
                <Col span={12}>
                  <FormItemGlobal name="role" label="Chức vụ" required>
                    <SelectFormikGlobal
                      name="role"
                      placeholder="Chức vụ"
                      options={[
                        {
                          label: "Lễ tân",
                          value: "ROLE_RECEPTIONIST",
                        },
                        {
                          label: "Kế toán",
                          value: "ROLE_ACCOUNTANT",
                        },
                      ]}
                    />
                  </FormItemGlobal>
                  <FormItemGlobal name="password" label="Mật khẩu" required>
                    <InputPasswordFormikGlobal
                      name="password"
                      placeholder="Mật khẩu"
                    />
                  </FormItemGlobal>
                </Col>
              </Row>
            </FormGlobal>
          </ModalGlobal>
        );
      }}
    </Formik>
  );
}
