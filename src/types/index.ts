import { Request } from "express";

export type AuthCookie = {
  accessToken: string;
  refreshToken: string;
};

export interface UserData {
  username: string;
  email: string;
  password: string;
  image: string | null;
}

export interface RegisterUserRequest extends Request {
  body: UserData;
}
