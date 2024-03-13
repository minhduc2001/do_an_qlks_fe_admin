import { fetcher } from "./Fetcher";

export interface IGetCustomersParams {
  page?: number;
  limit?: number;
  sort?: string[];
  search?: string;
}

export interface ICustomerRes {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  address: string;
  sex: string;
  email: string;
  tel: string;
  note: string;
  cccd: string;
}

export interface IGetCustomersRes {
  metadata: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  results: ICustomerRes[];
}

const getCustomers = (
  params?: IGetCustomersParams
): Promise<IGetCustomersRes> => {
  return fetcher({ method: "get", url: "/customer", params });
};
export default {
  getCustomers,
};
