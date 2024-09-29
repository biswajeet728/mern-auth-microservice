import { sql } from "drizzle-orm";
import {
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 60 }).notNull(),
  email: varchar("email", { length: 30 }).unique().notNull(),
  password: varchar("password", { length: 60 }).notNull(),
  image: text("image").default(sql`NULL`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});
