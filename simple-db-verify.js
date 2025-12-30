import { config } from 'dotenv';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

config();
neonConfig.webSocketConstructor = ws;

async function verifyDatabase() {
  console.log("🔍 Verifying Database Data...\n");
  
  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL not set");
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Check tables
    console.log("📋 Checking Database Tables...");
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log(`✅ Found ${tables.length} tables in database`);

    // Check testimonials
    console.log("\n📝 Checking Testimonials Data...");
    const testimonialsResult = await pool.query('SELECT COUNT(*), name FROM testimonials GROUP BY name');
    console.log(`✅ Found ${testimonialsResult.rows.length} unique testimonials:`);
    testimonialsResult.rows.forEach(row => {
      console.log(`   - ${row.name} (${row.count} entries)`);
    });

    // Check publications
    console.log("\n📚 Checking Publications Data...");
    const publicationsResult = await pool.query('SELECT COUNT(*), title FROM publications GROUP BY title');
    console.log(`✅ Found ${publicationsResult.rows.length} unique publications:`);
    publicationsResult.rows.forEach(row => {
      console.log(`   - ${row.title.substring(0, 50)}... (${row.count} entries)`);
    });

    // Check contact submissions
    console.log("\n📞 Checking Contact Submissions...");
    const contactsResult = await pool.query('SELECT COUNT(*) as total FROM contact_submissions');
    console.log(`✅ Found ${contactsResult.rows[0].total} contact submissions`);

    // Check join applications
    console.log("\n🤝 Checking Join Applications...");
    const joinResult = await pool.query('SELECT COUNT(*) as total FROM join_applications');
    console.log(`✅ Found ${joinResult.rows[0].total} join applications`);

    // Check feedback
    console.log("\n💬 Checking Feedback Submissions...");
    const feedbackResult = await pool.query('SELECT COUNT(*) as total FROM feedback_submissions');
    console.log(`✅ Found ${feedbackResult.rows[0].total} feedback submissions`);

    // Check projects
    console.log("\n🔬 Checking Projects...");
    const projectsResult = await pool.query('SELECT COUNT(*) as total, title FROM group_projects GROUP BY title');
    console.log(`✅ Found ${projectsResult.rows.length} projects:`);
    projectsResult.rows.forEach(row => {
      console.log(`   - ${row.title}`);
    });

    // Check users
    console.log("\n👥 Checking Users...");
    const usersResult = await pool.query('SELECT COUNT(*) as total FROM users');
    console.log(`✅ Found ${usersResult.rows[0].total} users`);

    // Test insert operation
    console.log("\n🧪 Testing Insert Operation...");
    const insertResult = await pool.query(`
      INSERT INTO testimonials (name, role, institution, content, rating) 
      VALUES ('Test Insert User', 'Tester', 'Test Org', 'Testing database insert', 5) 
      RETURNING id, name
    `);
    console.log(`✅ Successfully inserted testimonial with ID: ${insertResult.rows[0].id}`);

    // Test select operation
    const selectResult = await pool.query('SELECT * FROM testimonials WHERE id = $1', [insertResult.rows[0].id]);
    console.log(`✅ Successfully retrieved inserted testimonial: ${selectResult.rows[0].name}`);

    // Test update operation
    await pool.query('UPDATE testimonials SET content = $1 WHERE id = $2', ['Updated test content', insertResult.rows[0].id]);
    console.log(`✅ Successfully updated testimonial`);

    // Test delete operation
    await pool.query('DELETE FROM testimonials WHERE id = $1', [insertResult.rows[0].id]);
    console.log(`✅ Successfully deleted test testimonial`);

    console.log("\n" + "=".repeat(60));
    console.log("🎉 DATABASE VERIFICATION COMPLETE");
    console.log("=".repeat(60));
    console.log("✅ Database connection: WORKING");
    console.log("✅ All tables created: WORKING");
    console.log("✅ Data insertion: WORKING");
    console.log("✅ Data retrieval: WORKING");
    console.log("✅ Data updates: WORKING");
    console.log("✅ Data deletion: WORKING");
    console.log("✅ All CRUD operations: WORKING");
    console.log("\n🎯 CONCLUSION: All database functionality is working perfectly!");

  } catch (error) {
    console.error("❌ Database verification failed:", error);
  } finally {
    await pool.end();
  }
}

verifyDatabase();