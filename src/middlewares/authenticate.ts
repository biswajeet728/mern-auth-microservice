import { RequestHandler } from "express";
import {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
  verify,
} from "jsonwebtoken";
import { Config } from "../config";
import { ErrorHandler } from "../services/ErrorService";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        username: string;
        email: string;
        image: string | null;
        role: string;
      };
    }
  }
}

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const token = authToken?.split(" ")[1] || req.cookies.accessToken;

    console.log("Token: ", token);

    if (!token) {
      return next(
        new ErrorHandler("Unauthorized: Access token is required", 401)
      );
    }

    const decoded = verify(token, Config.JWT_SECRET!);
    if (typeof decoded === "string") {
      return next(new ErrorHandler("Forbidden: Invalid access token", 403));
    }
    const payload: JwtPayload = decoded;

    console.log("Payload: ", payload);

    if (!payload) {
      return next(new ErrorHandler("Forbidden: Invalid access token", 403));
    }

    req.user = {
      id: Number(payload.sub),
      username: payload.username,
      email: payload.email,
      image: payload.image || null,
      role: payload.role,
    };

    next();
  } catch (error) {
    console.log(error, "error");
    if (error instanceof TokenExpiredError) {
      return next(
        new ErrorHandler("Unauthorized: Access token has expired", 401)
      );
    }

    if (error instanceof JsonWebTokenError) {
      return next(new ErrorHandler("Forbidden: Invalid access token", 403));
    }

    next(error);
  }
};
