import { config } from 'dotenv';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import * as schema from "@shared/schema";
import { mockProjects } from "../client/src/lib/mock-projects";
import { migrateContentTables } from "./migrate-content";

// Load environment variables
config();

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required for migration");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });

  try {
    console.log("Starting database migration...");
    
    // Run migrations to create tables
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log("Database tables created successfully");

    // Run content tables migration
    await migrateContentTables();
    console.log("Content tables migration completed");

    // Check if projects already exist
    const existingProjects = await db.select().from(schema.groupProjects);
    if (existingProjects.length > 0) {
      console.log("Projects already exist in database, skipping data migration");
      return;
    }

    // Migrate mock project data
    console.log("Migrating mock project data...");
    for (const project of mockProjects) {
      await db.insert(schema.groupProjects).values({
        id: project.id,
        title: project.title,
        description: project.description,
        projectType: project.projectType,
        status: project.status,
        maxParticipants: project.maxParticipants,
        currentParticipants: project.currentParticipants,
        startDate: new Date(project.startDate),
        expectedCompletionDate: new Date(project.expectedCompletionDate),
        isPublic: project.isPublic,
        leadResearcherId: null, // Will be set when users are authenticated
      });
    }

    console.log(`Successfully migrated ${mockProjects.length} projects to database`);
    console.log("Migration completed successfully!");

  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();