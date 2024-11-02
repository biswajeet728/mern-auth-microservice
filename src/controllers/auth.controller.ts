import { JwtPayload } from "jsonwebtoken";
import {
  comparePassword,
  createUser,
  findUserByEmail,
} from "../services/UserService";
import { RegisterUserRequest, UserRespose } from "../types";
import { NextFunction, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  persistRefreshToken,
} from "../services/TokenService";
import createHttpError from "http-errors";

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

    // Set access token as a cookie
    res.cookie("accessToken", accessToken, {
      domain: "localhost",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      httpOnly: true, // Important for security
    });

    // Set refresh token as a cookie
    res.cookie("refreshToken", refreshToken, {
      domain: "localhost",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      httpOnly: true, // Important for security
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
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      domain: "localhost",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
    });

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
