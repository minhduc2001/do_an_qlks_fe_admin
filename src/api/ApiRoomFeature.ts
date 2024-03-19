import { fetcher } from "./Fetcher";

export interface IGetRoomFeaturesParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string[];
  filter?: string;
}

export interface IRoomFeatureRes {
  id: number;
  name: string;
}

export interface IRoomName {
  id: string;
  name: string;
  createdAt: Date;
  is_booking: boolean;
  booked_rooms?: any;
}

export interface IGetRoomFeaturesRes {
  metadata: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  results: IRoomFeatureRes[];
}

function getRoomFeatures(
  params?: IGetRoomFeaturesParams
): Promise<IGetRoomFeaturesRes> {
  return fetcher({ url: "room/get-feature-room", method: "get", params });
}

export default {
  getRoomFeatures,
};
