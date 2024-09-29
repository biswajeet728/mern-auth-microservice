import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, connectToDatabase, connection } from "./config/db"; // Import connectToDatabase

(async () => {
  try {
    // Establish the database connection
    await connectToDatabase();

    if (!db) {
      throw new Error("Database connection has not been established.");
    }

    await migrate(db, {
      migrationsFolder: "./drizzle",
    });
    console.log("Migration complete!");
    // Close the database connection
    await connection?.end();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
})();
