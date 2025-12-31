import { config } from 'dotenv';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

config();
neonConfig.webSocketConstructor = ws;

async function verifyMediaDatabase() {
  console.log("🔍 Verifying Media Library Database Setup...\n");
  
  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL not set");
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Check if media_library table exists
    console.log("📋 Checking media_library table...");
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'media_library'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log("✅ media_library table exists");
      
      // Check table structure
      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'media_library' 
        ORDER BY ordinal_position;
      `);
      
      console.log("📊 Table structure:");
      columnsResult.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : '(optional)'}`);
      });
      
      // Check existing media items
      const mediaCount = await pool.query('SELECT COUNT(*) as total FROM media_library');
      console.log(`\n📁 Current media items: ${mediaCount.rows[0].total}`);
      
      if (mediaCount.rows[0].total > 0) {
        const recentMedia = await pool.query(`
          SELECT file_name, original_name, file_type, file_size, created_at 
          FROM media_library 
          ORDER BY created_at DESC 
          LIMIT 5
        `);
        
        console.log("📷 Recent media items:");
        recentMedia.rows.forEach(media => {
          const sizeKB = Math.round(media.file_size / 1024);
          console.log(`   - ${media.original_name} (${media.file_type}, ${sizeKB}KB) - ${media.created_at.toISOString().split('T')[0]}`);
        });
      }
      
      // Test insert operation
      console.log("\n🧪 Testing media insert operation...");
      const testInsert = await pool.query(`
        INSERT INTO media_library (
          file_name, original_name, file_type, mime_type, 
          file_size, file_url, alt_text, description
        ) 
        VALUES (
          'test-image-' || extract(epoch from now()) || '.jpg',
          'test-image.jpg',
          'image',
          'image/jpeg',
          1024,
          '/uploads/test-image.jpg',
          'Test image',
          'Test image for database verification'
        ) 
        RETURNING id, file_name, created_at
      `);
      
      console.log(`✅ Successfully inserted test media with ID: ${testInsert.rows[0].id}`);
      
      // Clean up test data
      await pool.query('DELETE FROM media_library WHERE id = $1', [testInsert.rows[0].id]);
      console.log("✅ Test data cleaned up");
      
    } else {
      console.log("❌ media_library table does not exist");
      console.log("💡 Run 'npm run db:migrate' to create the table");
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎯 MEDIA LIBRARY DATABASE VERIFICATION");
    console.log("=".repeat(60));
    
    if (tableCheck.rows[0].exists) {
      console.log("✅ Database setup: COMPLETE");
      console.log("✅ Media table: EXISTS");
      console.log("✅ Insert operation: WORKING");
      console.log("✅ Media uploads will save to database: YES");
      console.log("\n🎉 Your Media Library is fully database-enabled!");
    } else {
      console.log("❌ Database setup: INCOMPLETE");
      console.log("❌ Media table: MISSING");
      console.log("⚠️  Media uploads will use file storage only");
    }

  } catch (error) {
    console.error("❌ Database verification failed:", error);
  } finally {
    await pool.end();
  }
}

verifyMediaDatabase();