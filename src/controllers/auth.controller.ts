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
      role: user?.role,
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
      role: user?.role,
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

// Controller logic
export const getNewAccessToken = async (
  req: RegisterUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const refToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : req.cookies.refreshToken;

    if (!refToken) {
      return next(createHttpError(401, "Unauthorized"));
    }

    let decoded: JwtPayload;
    try {
      decoded = verify(refToken, Config.REFRESH_TOKEN_SECRET!) as JwtPayload;
    } catch (err) {
      return next(createHttpError(401, "Invalid refresh token"));
    }

    if (!decoded || !decoded.sub) {
      return next(createHttpError(400, "Invalid token payload"));
    }

    const existingToken = await findRefreshToken(decoded.sub as string);
    if (!existingToken) {
      return next(createHttpError(401, "Refresh token not found or expired"));
    }

    const user = await findUserById(decoded.sub as string);
    if (!user) {
      return next(
        createHttpError(400, "User associated with the token not found")
      );
    }

    // Generate new tokens
    const payload: JwtPayload = {
      sub: String(decoded.sub),
      username: decoded.username,
      email: decoded.email,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshTokenId = await persistRefreshToken(user as UserRespose);

    // Remove old refresh token
    await deleteRefreshToken(String(existingToken.id));

    const newRefreshToken = generateRefreshToken({
      ...payload,
      id: String(newRefreshTokenId),
    });

    // Set cookies
    res.cookie("accessToken", newAccessToken, {
      domain: "localhost",
      sameSite: "strict",
      maxAge: 1000 * 60 * 5, // 5 minutes
      httpOnly: true,
    });

    res.cookie("refreshToken", newRefreshToken, {
      domain: "localhost",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      httpOnly: true,
    });

    logger.info("New access token generated");

    res.status(200).json({ id: user.id });
  } catch (error) {
    next(error);
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
