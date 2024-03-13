import { fetcher } from "./Fetcher";

export interface IGetPromotionsParams {
  page?: number;
  limit?: number;
  sort?: string[];
  search?: string;
}

export interface IPromotionRes {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  startDate: string;
  endDate: string;
  discount: number;
}

export interface IGetPromotionsRes {
  metadata: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  results: IPromotionRes[];
}

const getPromotions = (
  params?: IGetPromotionsParams
): Promise<IGetPromotionsRes> => {
  return fetcher({ method: "get", url: "/promotion/list", params });
};

const createPromotion = (data: FormData) => {
  return fetcher(
    { method: "post", url: "/promotion/save", data },
    { isFormData: true }
  );
};

const updatePromotion = (data: FormData) => {
  return fetcher(
    { method: "put", url: "/promotion/update", data },
    { isFormData: true }
  );
};

export default {
  getPromotions,
  createPromotion,
  updatePromotion,
};
