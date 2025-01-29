import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .min(2, "Username must be at least 2 characters")
    .trim()
    .max(100),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters"),
  image: z.string().default(""),
  role: z.enum(["admin", "user"]).default("user"),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
  password: z.string({
    required_error: "Password is required",
  }),
});
