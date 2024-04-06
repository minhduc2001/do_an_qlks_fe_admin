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
  start_date: string;
  end_date: string;
  discount: number;
  quantity: number;
  condition: number;
  active: boolean;
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
  return fetcher({ method: "get", url: "/promotion", params });
};

const createPromotion = (data: FormData) => {
  return fetcher(
    { method: "post", url: "/promotion", data },
    { isFormData: true }
  );
};

const updatePromotion = (data: FormData) => {
  return fetcher(
    { method: "put", url: "/promotion", data },
    { isFormData: true }
  );
};

const active = (data: { id: string; active: boolean }): Promise<string> => {
  return fetcher({
    method: "patch",
    url: "/promotion/" + data.id,
    data: { active: data.active },
  });
};

export default {
  getPromotions,
  createPromotion,
  updatePromotion,
  active,
};
