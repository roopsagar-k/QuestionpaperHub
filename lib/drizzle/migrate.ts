import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

if (!process.env.DB_URL) {
  throw new Error("DB_URL environment variable is required.");
}

const client = new pg.Client({
  connectionString: process.env.DB_URL,
});

const db = drizzle(client);

async function runMigration() {
  try {
    await client.connect();

    await migrate(db, {
      migrationsFolder: "./lib/drizzle/migrations",
    });

    process.exit(0);
  } catch (err) {
    console.error("Error during migration", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
