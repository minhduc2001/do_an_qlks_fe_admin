import { ICustomerRes } from "./ApiCustomer";
import { IRoomRes } from "./ApiRoom";
import { downloadFile, fetcher } from "./Fetcher";

export interface IGetBookingsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string[];
  filter?: string;
}

interface IUsedServices {
  id: string;
  name: "Dich vu 001";
  quantity: 1;
  price: 10000;
  createdAt: string;
}

export interface IBookingRes {
  id: string;
  bookingDate: string;
  selloff: number;
  note: string;
  checkin: string;
  checkout: string;
  price: string;
  usedServices?: IUsedServices[];
  client?: ICustomerRes;
  room?: IRoomRes;
  checkedIn: boolean;
  bookingState: "Init" | "AdminInit" | "Success" | "Done" | "Reject";
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
  firstName: string;
  lastName: string;
  sex: string;
  email: string;
  tel: string;
  checkin: string;
  checkout: string;
  quantity: number;
  idRoom?: string;
  paymentType: "Momo" | "Vnpay" | "Zalopay" | "Cash";
}

interface IUpdateServiceBody {
  id: string;
  body: { idService?: string; quantity?: number }[];
}

function getBookings(params?: IGetBookingsParams): Promise<IGetBookingsRes> {
  return fetcher({ url: "booking/list", method: "get", params });
}

function createBooking(data: ICreateBookingBody) {
  return fetcher({ url: "booking/admin-booking", method: "post", data });
}

function updateService(data: IUpdateServiceBody) {
  return fetcher({
    url: `booking/update-service/${data.id}`,
    method: "put",
    data: data.body,
  });
}

function checkIn(id: string) {
  return fetcher({ url: `booking/check-in/${id}`, method: "post" });
}

function checkOut(id: string) {
  return fetcher({ url: `booking/check-out/${id}`, method: "post" });
}

function cancelRoom(id: string) {
  return fetcher({ url: `booking/cancel/${id}`, method: "post" });
}

function downloadBill(id: string) {
  return downloadFile({
    url: "/booking/export-bill",
    params: { id },
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
