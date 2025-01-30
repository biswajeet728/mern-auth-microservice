import { config } from "dotenv";
import path from "path";
import { z } from "zod";

// Load environment variables from the appropriate .env file
config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});

// config({
//   path: path.join(__dirname, ../../.env),
// });

// Define a Zod schema for the environment variables
const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/).transform(Number), // Ensures PORT is a number
  NODE_ENV: z.string(),
  MYSQL_PORT: z.string().regex(/^\d+$/).transform(Number), // Ensures MYSQL_PORT is a number
  MYSQL_PASSWORD: z.string(),
  MYSQL_HOST: z.string(),
  MYSQL_USER: z.string(),
  MYSQL_DATABASE: z.string(),
  MYSQL_URI: z.string().url(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  JWT_SECRET: z.string(),
});

// Validate the environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  process.exit(1); // Exit if validation fails
}

// Export the validated and parsed environment variables
export const Config = {
  PORT: parsedEnv.data.PORT,
  NODE_ENV: parsedEnv.data.NODE_ENV,
  MYSQL_PORT: parsedEnv.data.MYSQL_PORT,
  MYSQL_PASSWORD: parsedEnv.data.MYSQL_PASSWORD,
  MYSQL_HOST: parsedEnv.data.MYSQL_HOST,
  MYSQL_USER: parsedEnv.data.MYSQL_USER,
  MYSQL_DATABASE: parsedEnv.data.MYSQL_DATABASE,
  MYSQL_URI: parsedEnv.data.MYSQL_URI,
  ACCESS_TOKEN_SECRET: parsedEnv.data.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: parsedEnv.data.REFRESH_TOKEN_SECRET,
  JWT_SECRET: parsedEnv.data.JWT_SECRET,
};
