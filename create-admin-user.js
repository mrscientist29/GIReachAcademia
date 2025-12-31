import { config } from 'dotenv';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

config();
neonConfig.webSocketConstructor = ws;

async function createAdminUser() {
  console.log("👤 Creating Admin User in Database...\n");
  
  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL not set");
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Check if admin user already exists
    console.log("🔍 Checking for existing admin user...");
    const existingUser = await pool.query(
      'SELECT id, email, role FROM users WHERE id = $1 OR email = $2',
      ['admin-user', 'admin@gireach.pk']
    );

    if (existingUser.rows.length > 0) {
      console.log("✅ Admin user already exists:");
      existingUser.rows.forEach(user => {
        console.log(`   - ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);
      });
      return;
    }

    // Create admin user
    console.log("👤 Creating admin user...");
    const adminUser = await pool.query(`
      INSERT INTO users (
        id, email, first_name, last_name, role, is_active, created_at, updated_at
      ) VALUES (
        'admin-user',
        'admin@gireach.pk', 
        'Admin',
        'User',
        'admin',
        true,
        NOW(),
        NOW()
      ) 
      RETURNING id, email, first_name, last_name, role, created_at
    `);

    console.log("✅ Admin user created successfully:");
    const user = adminUser.rows[0];
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Name: ${user.first_name} ${user.last_name}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Created: ${user.created_at}`);

    console.log("\n" + "=".repeat(60));
    console.log("🎉 ADMIN USER SETUP COMPLETE");
    console.log("=".repeat(60));
    console.log("✅ Admin user exists in database");
    console.log("✅ Media uploads can now reference admin user");
    console.log("✅ Foreign key constraint will be satisfied");
    console.log("\n💡 You can now upload media files without foreign key errors!");

  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
  } finally {
    await pool.end();
  }
}

createAdminUser();