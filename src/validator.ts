import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .min(6, "Username must be at least 6 characters")
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
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
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
