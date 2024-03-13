import { IRoomFeatureRes, IRoomName } from "./ApiRoomFeature";
import { fetcher } from "./Fetcher";

export interface IGetRoomsParams {
  page?: number;
  limit?: number;
  sort?: string[];
  search?: string;
}

export interface IRoomRes {
  id: string;
  name: string;
  price: number;
  description: string;
  slug: string;
  images?: string[];
  feature_rooms?: IRoomFeatureRes[];
  rooms?: IRoomName[];
}

export interface IGetRoomsRes {
  metadata: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  results: IRoomRes[];
}

interface IUpdateRoomNameBody {
  id: string;
  body: { id?: string; name?: string }[];
}

const getRooms = (params?: IGetRoomsParams): Promise<IGetRoomsRes> => {
  return fetcher({ method: "get", url: "/room", params });
};

const getRoomsWithRelation = (
  params?: IGetRoomsParams
): Promise<IGetRoomsRes> => {
  return fetcher({ method: "get", url: "/room/with-relation", params });
};

const createRoom = (data: FormData): Promise<IGetRoomsRes> => {
  return fetcher({ method: "post", url: "/room", data }, { isFormData: true });
};

const updateRoom = (data: {
  id: number;
  formData: FormData;
}): Promise<IGetRoomsRes> => {
  return fetcher(
    { method: "put", url: `/room/${data.id}`, data: data.formData },
    { isFormData: true }
  );
};

const updateRoomName = (data: IUpdateRoomNameBody): Promise<IGetRoomsRes> => {
  return fetcher({
    method: "post",
    url: "/room/save-room-name/" + data.id,
    data: data.body,
  });
};

export default {
  getRooms,
  getRoomsWithRelation,
  createRoom,
  updateRoom,
  updateRoomName,
};
