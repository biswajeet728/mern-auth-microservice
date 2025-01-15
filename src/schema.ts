import { sql } from "drizzle-orm";
import {
  bigint,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// Define id as BIGINT
export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(), // No unsigned
  username: varchar("username", { length: 60 }).notNull(),
  email: varchar("email", { length: 30 }).unique().notNull(),
  password: varchar("password", { length: 60 }).notNull(),
  image: text("image").default(sql`NULL`),
  role: varchar("role", { length: 10 }).default(sql`'user'`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Match BIGINT type for userId
export const refreshTokens = mysqlTable("refresh_tokens", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  userId: bigint("user_id", { mode: "bigint" }) // Ensure BIGINT matches users.id
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: timestamp("expires_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});
