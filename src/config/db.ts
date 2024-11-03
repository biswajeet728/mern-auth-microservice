import logger from "./logger";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { Config } from ".";

export let db: ReturnType<typeof drizzle> | null = null;
export let connection: mysql.Connection | null = null;

export const connectToDatabase = async () => {
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: Config.MYSQL_USER,
      database: Config.MYSQL_DATABASE,
      password: Config.MYSQL_PASSWORD,
      port: Config.MYSQL_PORT!,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    db = drizzle(connection);
    logger.info("Connected to the database successfully!");
  } catch (error) {
    logger.error("Error connecting to the database:", error);
    throw error;
  }
};
