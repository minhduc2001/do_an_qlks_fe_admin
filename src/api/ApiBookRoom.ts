import { Moment } from "moment";
import { ICustomerRes } from "./ApiCustomer";
import { IRoomRes } from "./ApiRoom";
import { EGender } from "./ApiUser";
import { downloadFile, fetcher } from "./Fetcher";

export enum EPaymentType {
  Momo,
  Vnpay,
  Zalopay,
  Cash,
}

export interface IGetBookingsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string[];
  filter?: string;
}

interface IUsedServices {
  id: string;
  name: string;
  quantity: number;
  service: { price: number };
  createdAt: string;
}

export enum EBookingState {
  Init, // khoi tao
  AdminInit, // khoi tao bang admin
  Success, // khi thanh toan phong thanh cong
  Done, // check out
  Reject, // don bi huy
}

export interface IBookingRes {
  id: string;
  booking_date: Date;
  note: string;
  checkin: Date;
  checkout: Date;
  price: string;
  used_services?: IUsedServices[];
  customer?: ICustomerRes;
  user?: ICustomerRes;
  is_checked_in: boolean;
  is_checked_out: boolean;
  state: EBookingState;
  booked_rooms?: { room?: IRoomRes }[];
}

export interface IGetBookingsRes {
  metadata: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  results: IBookingRes[];
}

interface ICreateBookingBody {
  username: string;
  gender: EGender;
  email: string;
  phone: string;
  checkin: Moment;
  checkout: Moment;
  quantity: number;
  type_room_id?: number;
  payment_type: EPaymentType;
  id?: number;
}

interface IUpdateServiceBody {
  id: string;
  body: { service_id?: number; quantity?: number }[];
}

function getBookings(params?: IGetBookingsParams): Promise<IGetBookingsRes> {
  return fetcher({ url: "booking", method: "get", params });
}

function createBooking(data: ICreateBookingBody) {
  return fetcher({ url: "booking/cms", method: "post", data });
}

function updateService(data: IUpdateServiceBody) {
  return fetcher({
    url: `booking/${data.id}/add-service`,
    method: "patch",
    data: data.body,
  });
}

function checkIn(id: string) {
  return fetcher({ url: `booking/checkin/${id}`, method: "patch" });
}

function checkOut(id: string) {
  return fetcher({ url: `booking/checkout/${id}`, method: "patch" });
}

function cancelRoom(id: string) {
  return fetcher({ url: `booking/cancel/${id}`, method: "patch" });
}

function downloadBill(id: string) {
  return downloadFile({
    url: "/booking/export-bill/" + id,
    fileName: `bill_of_room_id_${id}`,
    type: "pdf",
  });
}

export default {
  getBookings,
  createBooking,
  updateService,
  checkIn,
  checkOut,
  cancelRoom,
  downloadBill,
};
