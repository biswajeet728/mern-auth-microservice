import { UserData } from "../types";
import { db } from "../config/db";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { ErrorHandler } from "./ErrorService";

export const createUser = async ({
  username,
  email,
  password,
  image,
}: UserData) => {
  const user = await db
    ?.select()
    .from(users)
    .where(eq(users.email, email))
    .execute();

  if (user?.length) {
    throw new ErrorHandler("User already exists", 409);
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await db
      ?.insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        image,
      })
      .execute();

    const res = await db
      ?.select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    return res?.[0];
  } catch (error) {
    throw new ErrorHandler("Failed to create user", 500);
  }
};

export const findUserByEmail = async (email: string) => {
  const res = await db
    ?.select({
      id: users.id,
      email: users.email,
      username: users.username,
      image: users.image,
      password: users.password,
      role: users.role,
    })
    .from(users)
    .where(eq(users.email, email))
    .execute();

  return res?.[0];
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const findUserById = async (id: string) => {
  const res = await db
    ?.select({
      id: users.id,
      email: users.email,
      username: users.username,
      image: users.image,
    })
    .from(users)
    .where(eq(users.id, Number(id)))
    .execute();

  return res?.[0];
};
