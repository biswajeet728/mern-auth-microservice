import { config } from "dotenv";
import path from "path";

config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});
// config({
//   path: path.join(__dirname, `../../.env`),
// });

const {
  PORT,
  NODE_ENV,
  MYSQL_PORT,
  MYSQL_PASSWORD,
  MYSQL_USER,
  MYSQL_DATABASE,
  MYSQL_URI,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = process.env;

export const Config = {
  PORT,
  NODE_ENV,
  MYSQL_PORT,
  MYSQL_PASSWORD,
  MYSQL_USER,
  MYSQL_DATABASE,
  MYSQL_URI,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
};
