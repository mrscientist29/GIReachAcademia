import { config } from 'dotenv';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import { websiteSettings, pageContents, mediaLibrary } from "@shared/schema";

// Load environment variables
config();

neonConfig.webSocketConstructor = ws;

async function migrateContentTables() {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL not set. Skipping migration.");
    return;
  }

  console.log("Starting content tables migration...");
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool });

  try {
    // Create website_settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS website_settings (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        setting_key VARCHAR UNIQUE NOT NULL,
        setting_value JSONB NOT NULL,
        is_active BOOLEAN DEFAULT true,
        updated_by_id VARCHAR REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✓ Created website_settings table");

    // Create page_contents table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS page_contents (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        page_id VARCHAR UNIQUE NOT NULL,
        page_name TEXT NOT NULL,
        sections JSONB NOT NULL,
        is_published BOOLEAN DEFAULT true,
        updated_by_id VARCHAR REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✓ Created page_contents table");

    // Create media_library table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS media_library (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        file_name TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_type VARCHAR NOT NULL,
        mime_type VARCHAR NOT NULL,
        file_size INTEGER NOT NULL,
        file_url TEXT NOT NULL,
        alt_text TEXT,
        description TEXT,
        uploaded_by_id VARCHAR REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✓ Created media_library table");

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_website_settings_key ON website_settings(setting_key);
      CREATE INDEX IF NOT EXISTS idx_page_contents_page_id ON page_contents(page_id);
      CREATE INDEX IF NOT EXISTS idx_media_library_type ON media_library(file_type);
    `);
    console.log("✓ Created indexes");

    console.log("Content tables migration completed successfully!");
    
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateContentTables()
    .then(() => {
      console.log("Migration completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

export { migrateContentTables };