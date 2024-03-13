import * as Yup from "yup";

const BookingValidation = Yup.object().shape({
  firstName: Yup.string().trim().required("Họ và tên không được để trống"),
  lastName: Yup.string().required("Họ và tên không được để trống"),
  email: Yup.string().trim().required("Email không được để trống"),
  tel: Yup.string().trim().required("Số điện thoại không được để trống"),
  idRoom: Yup.string().required("Phòng không được để trống"),
  quantity: Yup.string().required("Số lượng phòng không được để trống"),
});

export { BookingValidation };
