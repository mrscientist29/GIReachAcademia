import { config } from 'dotenv';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Load environment variables first
config();

neonConfig.webSocketConstructor = ws;

let db: any;
let pool: Pool | undefined;

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set. Using mock database for development.");
  // Use mock database for development
  db = {
    select: () => ({
      from: () => ({
        where: () => Promise.resolve([]),
        orderBy: () => Promise.resolve([]),
      }),
    }),
    insert: () => ({
      values: () => ({
        returning: () => Promise.resolve([{ id: 'mock-id' }]),
        onConflictDoUpdate: () => ({
          returning: () => Promise.resolve([{ id: 'mock-id' }]),
        }),
      }),
    }),
    update: () => ({
      set: () => ({
        where: () => ({
          returning: () => Promise.resolve([{ id: 'mock-id' }]),
        }),
      }),
    }),
  };
} else {
  console.log("DATABASE_URL found. Connecting to PostgreSQL database.");
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { db, pool };