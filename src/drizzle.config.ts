import { Config } from "./config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: Config.MYSQL_URI!,
  },
});
