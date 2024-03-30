import store from "@/redux/store";
import { fetcher } from "./Fetcher";

export enum EGender {
  Male,
  Female,
  Other,
}

export interface ILoginBody {
  email: string;
  password: string;
}

export interface ILoginRes {
  email?: string;
  username?: string;
  address?: string;
  phone?: string;
  role?: "ROLE_ADMIN" | "ROLE_RECEPTIONIST" | "ROLE_ACCOUNTANT";
  accessToken?: string;
  active?: true;
  avatar?: string;
  cccd?: string;
  password?: string;
  id?: number;
}

export interface ICreateUser {
  email: string;
  username: string;
  role: "ROLE_ADMIN" | "ROLE_RECEPTIONIST" | "ROLE_ACCOUNTANT";
  password: string;
  id?: number;
}

export interface IGetUserRes {
  metadata: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  results: ILoginRes[];
}

function login(data: ILoginBody): Promise<ILoginRes> {
  return fetcher(
    { url: "auth/login", method: "post", data },
    { isXWWWForm: true }
  );
}

function getUser(): Promise<IGetUserRes> {
  return fetcher({ url: "user", method: "get" });
}

function createUser(data: ICreateUser): Promise<ILoginRes> {
  return fetcher({ url: "user", method: "post", data });
}

function updateUser(data: any): Promise<ILoginRes> {
  const { id, ...rest } = data;
  return fetcher({
    url: "user/" + id + "/cms",
    method: "put",
    data: rest.data,
  });
}

function activeUser(data: any): Promise<string> {
  const { id, ...rest } = data;
  return fetcher({ url: "user/active/" + id, method: "put", data: rest });
}

function getAuthToken(): string | undefined {
  const { user } = store.getState();
  return user.accessToken;
}

function isLogin(): boolean {
  return !!getAuthToken();
}

function checkMail(data: any): Promise<ILoginRes[]> {
  return fetcher({ url: "customer/mail", method: "post", data });
}

function getMe(): Promise<ILoginRes> {
  return fetcher({ url: "auth/get-me", method: "get" });
}

export default {
  login,
  isLogin,
  checkMail,
  getMe,
  getUser,
  createUser,
  updateUser,
  activeUser,
};
