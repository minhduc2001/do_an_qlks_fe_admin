import * as Yup from "yup";

const ServiceValidation = (type: "create" | "edit") =>
  Yup.object().shape({
    name: Yup.string().trim().required("Tên dịch vụ không được để trống"),
    price: Yup.string().trim().required("Giá dịch vụ không được để trống"),
    file:
      type === "create"
        ? Yup.string().required("Ảnh minh họa không được để trống")
        : Yup.string(),
  });

export { ServiceValidation };
