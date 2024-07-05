import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import pg from "pg";



const client = new pg.Client({
  connectionString: process.env.DB_URL,
});

const connectToDatabase = () => {
  try {
    client.connect();
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

connectToDatabase();

export const db = drizzle(client, { schema, logger: true });
