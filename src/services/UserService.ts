import createHttpError from "http-errors";
import { UserData } from "../types";
import { db } from "../config/db";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

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
    throw createHttpError(409, {
      message: "User already exists",
      context: { email },
    });
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
    const err = createHttpError(
      500,
      "Failed to store the data in the database"
    );
    throw err;
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
    })
    .from(users)
    .where(eq(users.email, email))
    .execute();

  return res?.[0];
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
