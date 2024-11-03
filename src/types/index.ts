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
  refreshToken?: string;
}

export interface RegisterUserRequest extends Request {
  body: UserData;
}

export interface UserRespose extends UserData {
  id: number;
  updatedAt: Date;
  createdAt: Date;
}
