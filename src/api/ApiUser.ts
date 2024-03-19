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
}

function login(data: ILoginBody): Promise<ILoginRes> {
  return fetcher(
    { url: "auth/login", method: "post", data },
    { isXWWWForm: true }
  );
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

export default {
  login,
  isLogin,
  checkMail,
};
