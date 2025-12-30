import { config } from 'dotenv';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

config();

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

async function testConnection() {
  console.log("🔍 Testing database connection...");
  
  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL not set - application will use file storage");
    console.log("📁 Current storage mode: File-based (temporary)");
    return false;
  }

  try {
    console.log("🔗 Attempting to connect to database...");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    
    console.log("✅ Database connected successfully!");
    console.log("📅 Current time:", result.rows[0].current_time);
    console.log("🗄️  Database version:", result.rows[0].db_version.split(' ')[0]);
    
    // Test if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log("📋 Existing tables:", tablesResult.rows.map(row => row.table_name).join(', '));
    } else {
      console.log("⚠️  No tables found - run 'npm run db:migrate' to create tables");
    }
    
    await pool.end();
    return true;
  } catch (error) {
    console.log("❌ Database connection failed:", error.message);
    console.log("📁 Falling back to file storage mode");
    return false;
  }
}

// Run the test
testConnection().then(connected => {
  if (connected) {
    console.log("\n🎉 Database is ready for production deployment!");
  } else {
    console.log("\n📝 To enable database storage:");
    console.log("1. Set DATABASE_URL environment variable");
    console.log("2. Run 'npm run db:migrate' to create tables");
    console.log("3. Restart the application");
  }
  process.exit(0);
});