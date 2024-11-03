import { JwtPayload, verify } from "jsonwebtoken";
import {
  comparePassword,
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/UserService";
import { RegisterUserRequest, UserRespose } from "../types";
import { NextFunction, Response } from "express";
import {
  deleteRefreshToken,
  findRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  persistRefreshToken,
} from "../services/TokenService";
import createHttpError from "http-errors";
import { Config } from "../config";
import logger from "../config/logger";

export const create = async (
  req: RegisterUserRequest,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, image } = req.body;

  try {
    const user = await createUser({ username, email, password, image });

    // Ensure that the user ID is a string to avoid BigInt serialization issues
    const payload: JwtPayload = {
      sub: String(user?.id), // Convert to string to avoid BigInt issues
      username: user?.username,
      email: user?.email,
    };

    console.log(payload, "payload");

    // Generate access token
    const accessToken = generateAccessToken(payload);

    // Persist the refresh token and retrieve its value
    const newRefreshToken = await persistRefreshToken(user as UserRespose);

    // Check if the newRefreshToken is a BigInt and convert it to a string
    const refreshToken = generateRefreshToken({
      ...payload,
      id: String(newRefreshToken), // Convert to string if necessary
    });

    res.cookie("accessToken", accessToken, {
      domain: "localhost",
      sameSite: "strict",
      // maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      maxAge: 1000 * 60 * 5, // 5 minutes
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      domain: "localhost",
      sameSite: "strict",
      // maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      httpOnly: true,
    });

    res.status(201).json({ id: user?.id });
  } catch (error) {
    next(error);
    return;
  }
};

export const login = async (
  req: RegisterUserRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      const err = createHttpError(404, "Invalid Credentials !");
      next(err);
      return;
    }

    const matchPasword = await comparePassword(password, user.password);

    if (!matchPasword) {
      const err = createHttpError(404, "Invalid Credentials !");
      next(err);
      return;
    }

    const payload: JwtPayload = {
      sub: String(user.id),
      username: user.username,
      email: user.email,
    };

    const accessToken = generateAccessToken(payload);

    const newRefreshToken = await persistRefreshToken(user as UserRespose);

    const refreshToken = generateRefreshToken({
      ...payload,
      id: String(newRefreshToken),
    });

    res.cookie("accessToken", accessToken, {
      domain: "localhost",
      sameSite: "strict",
      // maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      maxAge: 1000 * 60 * 5, // 5 minutes
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      domain: "localhost",
      sameSite: "strict",
      // maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      httpOnly: true,
    });

    console.log("Ref Token", refreshToken);
    console.log("Access Token", accessToken);

    res.status(200).json({ id: user.id });
  } catch (error) {
    next(error);
    return;
  }
};

export const getMe = async (req: RegisterUserRequest, res: Response) => {
  const user = req.user;

  res.status(200).json(user);
};

export const getNewAccessToken = async (
  req: RegisterUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const refToken = req.headers.authorization || req.cookies.refreshToken;

    if (!refToken) {
      const err = createHttpError(401, "Unauthorized");
      next(err);
      return;
    }

    const decoded = verify(
      refToken,
      Config.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;

    const token = await findRefreshToken(decoded.sub as string);

    const payload: JwtPayload = {
      sub: String(decoded.sub),
      username: decoded.username,
      email: decoded.email,
    };

    const accessToken = generateAccessToken(payload);

    const user = await findUserById(decoded.sub as string);

    if (!user) {
      const error = createHttpError(400, "User with the token could not find");
      next(error);
      return;
    }

    const newRefreshToken = await persistRefreshToken(user as UserRespose);

    await deleteRefreshToken(String(token?.id));

    const refreshToken = generateRefreshToken({
      ...payload,
      id: String(newRefreshToken),
    });

    res.cookie("accessToken", accessToken, {
      domain: "localhost",
      sameSite: "strict",
      // maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      maxAge: 1000 * 60 * 5, // 5 minutes
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      domain: "localhost",
      sameSite: "strict",
      // maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      httpOnly: true,
    });

    logger.info("New access token generated");

    res.status(200).json({ id: user.id });
  } catch (error) {
    next(error);
    return;
  }
};

export const logout = async (
  req: RegisterUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await findRefreshToken(String(req.user?.id));

    if (!token) {
      const error = createHttpError(404, "Token not found");
      next(error);
      return;
    }

    await deleteRefreshToken(String(token.id));

    logger.info("Refresh token deleted");

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({
      message: "Logged out successfully",
    });

    logger.info("Cookies cleared");
  } catch (error) {
    next(error);
    return;
  }
};
