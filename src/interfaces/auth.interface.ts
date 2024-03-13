export interface IUser {
  username: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface IToken {
  accessToken?: string;
  refreshToken?: string;
}

export interface ILoginData {
  username?: string;
  email?: string;
  password: string;
}

export interface IRegisterData {
  username?: string;
  email: string;
  phone?: string;
  birthday?: Date;
  password?: string;
  rePassword?: string;
}

export interface IForgetPassword {
  email?: string;
  phone?: string;
  username?: string;
}

export interface IOTP {
  otp: number;
}
