import { RegisterUserRequest } from "@/types";
import { NextFunction, Response } from "express";

export const register = async (
  req: RegisterUserRequest,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, image } = req.body;
};
