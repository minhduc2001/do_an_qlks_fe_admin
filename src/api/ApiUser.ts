import store from "@/redux/store";
import { fetcher } from "./Fetcher";

export interface ILoginBody {
  email: string;
  password: string;
}

export interface ILoginRes {
  email?: string;
  name?: string;
  address?: string;
  phoneNumber?: string;
  role?: "ROLE_ADMIN" | "ROLE_RECEPTIONIST" | "ROLE_MANAGE" | "ROLE_ACCOUNTANT";
  accessToken?: string;
  active?: true;
  avatar?: string;
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

export default {
  login,
  isLogin,
};
