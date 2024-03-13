import * as Yup from "yup";

const LoginValidation = Yup.object().shape({
  email: Yup.string().required("Email không được để trống"),
  password: Yup.string().required("Password không được để trống"),
});

export { LoginValidation };
