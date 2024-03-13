import { useMemo, useRef } from "react";
import { Formik, FormikProps } from "formik";
import { Col, Divider, Row } from "antd";
import ModalGlobal from "..";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Notification from "@/components/Notification";
import FormGlobal, {
  DatePickerFormikGlobal,
  FormItemGlobal,
  InputFormikGlobal,
  InputNumberFormikGlobal,
  RadioGroupFormikGlobal,
  SelectFormikGlobal,
} from "@/components/FormGlobal";
import ApiBookRoom from "@/api/ApiBookRoom";
import moment, { Moment } from "moment";
import ApiRoom from "@/api/ApiRoom";
import { BookingValidation } from "@/utils/validation/booking";

interface ICreateBookingBody {
  firstName: string;
  lastName: string;
  sex: "male" | "female";
  email: string;
  tel: string;
  checkin: Moment;
  checkout: Moment;
  quantity: number;
  idRoom?: string;
  paymentType: "Momo" | "Vnpay" | "Zalopay" | "Cash";
}

interface IModalCreateBooking {
  isOpenModal: boolean;
  handleCloseModal: () => void;
}

export default function ModalCreateBooking({
  isOpenModal,
  handleCloseModal,
}: IModalCreateBooking) {
  const innerRef = useRef<FormikProps<ICreateBookingBody>>(null);
  const queryClient = useQueryClient();

  const initialValues: ICreateBookingBody = useMemo(() => {
    return {
      firstName: "",
      lastName: "",
      sex: "male",
      email: "",
      tel: "",
      checkin: moment().startOf("day"),
      checkout: moment().startOf("day").add(1, "day"),
      quantity: 0,
      idRoom: undefined,
      paymentType: "Cash",
    };
  }, [isOpenModal]);

  const { data: rooms } = useQuery(["get_rooms"], () => ApiRoom.getRooms());
  const convertRoomsValue = useMemo(() => {
    return rooms?.results.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [rooms]);

  const onCancel = () => {
    handleCloseModal();
    innerRef.current?.resetForm();
  };

  const calculateNight = (sd: Moment, ed: Moment) => {
    const roomPrice =
      rooms?.results.find((item) => item.id === innerRef.current?.values.idRoom)
        ?.price ?? 0;

    return (
      ed.diff(sd, "days") *
      roomPrice *
      (innerRef.current?.values.quantity ?? 0)
    ).toLocaleString();
  };

  const createBookingMutation = useMutation(ApiBookRoom.createBooking);
  const handleSubmit = async (values: ICreateBookingBody) => {
    const newValues = {
      ...values,
      checkin: moment(values.checkin).format("YYYY-MM-DD"),
      checkout: moment(values.checkout).format("YYYY-MM-DD"),
    };

    createBookingMutation.mutate(newValues, {
      onSuccess: () => {
        Notification.notificationSuccess("Thành công");
        queryClient.refetchQueries(["get_bookings"]);
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
      validationSchema={BookingValidation}
    >
      {({ handleSubmit, values, setFieldValue }): JSX.Element => {
        return (
          <ModalGlobal
            open={isOpenModal}
            title="Đặt phòng"
            onOk={handleSubmit}
            onCancel={onCancel}
            isLoadingOK={createBookingMutation.isLoading}
            width={1000}
          >
            <FormGlobal>
              <Row gutter={[8, 0]}>
                <Col span={12}>
                  <FormItemGlobal name="lastName" label="Họ" required>
                    <InputFormikGlobal name="lastName" placeholder="Họ" />
                  </FormItemGlobal>
                  <FormItemGlobal name="email" label="Email" required>
                    <InputFormikGlobal name="email" placeholder="Email" />
                  </FormItemGlobal>
                  <FormItemGlobal name="sex" label="Giới tính">
                    <SelectFormikGlobal
                      name="sex"
                      placeholder="Giới tính"
                      options={[
                        { label: "Nam", value: "male" },
                        { label: "Nữ", value: "female" },
                      ]}
                    />
                  </FormItemGlobal>

                  <Row gutter={[8, 0]}>
                    <Col span={12}>
                      <FormItemGlobal name="cccd" label="CCCD" required>
                        <InputFormikGlobal name="cccd" placeholder="CCCD" />
                      </FormItemGlobal>
                    </Col>
                    <Col span={12}>
                      <FormItemGlobal name="address" label="Địa chỉ" required>
                        <InputFormikGlobal
                          name="address"
                          placeholder="Nhập địa chỉ"
                        />
                      </FormItemGlobal>
                    </Col>
                  </Row>

                  <FormItemGlobal name="checkin" label="Check-in" required>
                    <DatePickerFormikGlobal
                      name="checkin"
                      placeholder="Check-in"
                      allowClear={false}
                      disabledDate={(d) =>
                        d <= moment().subtract(1, "days") ||
                        d >= values.checkout
                      }
                      onChange={(date) => {
                        setFieldValue("checkin", date?.startOf("day"));
                      }}
                    />
                  </FormItemGlobal>
                  <FormItemGlobal
                    name="quantity"
                    label="Số lượng phòng"
                    required
                  >
                    <InputNumberFormikGlobal
                      name="quantity"
                      placeholder="Số lượng phòng"
                      min={1}
                    />
                  </FormItemGlobal>
                </Col>
                <Col span={12}>
                  <FormItemGlobal name="firstName" label="Tên" required>
                    <InputFormikGlobal name="firstName" placeholder="Tên" />
                  </FormItemGlobal>
                  <FormItemGlobal name="tel" label="Số điện thoại" required>
                    <InputFormikGlobal name="tel" placeholder="Số điện thoại" />
                  </FormItemGlobal>
                  <FormItemGlobal name="idRoom" label="Phòng" required>
                    <SelectFormikGlobal
                      name="idRoom"
                      placeholder="Phòng"
                      options={convertRoomsValue}
                      allowClear={false}
                    />
                  </FormItemGlobal>
                  <FormItemGlobal name="checkout" label="Check-out" required>
                    <DatePickerFormikGlobal
                      name="checkout"
                      placeholder="Check-out"
                      allowClear={false}
                      disabledDate={(d) => d <= values.checkin}
                      onChange={(date) => {
                        setFieldValue("checkout", date?.startOf("day"));
                      }}
                    />
                  </FormItemGlobal>
                </Col>
                <span className="font-bold mx-2">
                  Số tiền thanh toán:{" "}
                  {calculateNight(values.checkin, values.checkout)} VNĐ
                </span>
                <Divider />
                <div className="mt-5 mx-2">
                  <span className="font-bold">Phương thức thanh toán</span>
                  <FormItemGlobal name="paymentType" required>
                    <RadioGroupFormikGlobal
                      name="paymentType"
                      options={[
                        { label: "Momo", value: "Momo" },
                        { label: "Vnpay", value: "Vnpay" },
                        { label: "Zalopay", value: "Zalopay" },
                        { label: "Cash", value: "Cash" },
                      ]}
                    />
                  </FormItemGlobal>
                </div>
              </Row>
            </FormGlobal>
          </ModalGlobal>
        );
      }}
    </Formik>
  );
}
