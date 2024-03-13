import { fetcher } from "./Fetcher";

export interface IGetServicesParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string[];
  filter?: string;
}

export interface IServiceRes {
  id: string;
  name: string;
  unity: string;
  price: number;
  description: string;
  image: string;
}

export interface IGetServicesRes {
  metadata: {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    totalItems: number;
  };
  results: IServiceRes[];
}

function getServices(params?: IGetServicesParams): Promise<IGetServicesRes> {
  return fetcher({ url: "services", method: "get", params });
}

function createService(data: FormData) {
  return fetcher(
    { url: "/services", method: "post", data },
    { isFormData: true }
  );
}

function updateService({ id, data }: { id: number; data: FormData }) {
  return fetcher(
    {
      url: `/services/${id}`,
      method: "put",
      data,
    },
    { isFormData: true }
  );
}

export default {
  getServices,
  createService,
  updateService,
};
