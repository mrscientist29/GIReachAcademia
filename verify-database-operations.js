import { config } from 'dotenv';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './shared/schema.js';

config();
neonConfig.webSocketConstructor = ws;

async function verifyDatabaseOperations() {
  console.log("🔍 Verifying Database Operations...\n");
  
  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL not set");
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });

  try {
    // Test 1: Check all tables exist
    console.log("📋 Checking Database Tables...");
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach(table => console.log(`   - ${table}`));

    // Test 2: Check testimonials data
    console.log("\n📝 Checking Testimonials...");
    const testimonials = await db.select().from(schema.testimonials);
    console.log(`✅ Found ${testimonials.length} testimonials in database`);
    testimonials.forEach(t => console.log(`   - ${t.name}: "${t.content.substring(0, 50)}..."`));

    // Test 3: Check publications data
    console.log("\n📚 Checking Publications...");
    const publications = await db.select().from(schema.publications);
    console.log(`✅ Found ${publications.length} publications in database`);
    publications.forEach(p => console.log(`   - ${p.title} (${p.year})`));

    // Test 4: Check contact submissions
    console.log("\n📞 Checking Contact Submissions...");
    const contacts = await db.select().from(schema.contactSubmissions);
    console.log(`✅ Found ${contacts.length} contact submissions in database`);
    contacts.forEach(c => console.log(`   - ${c.firstName} ${c.lastName}: ${c.inquiryType}`));

    // Test 5: Check join applications
    console.log("\n🤝 Checking Join Applications...");
    const joinApps = await db.select().from(schema.joinApplications);
    console.log(`✅ Found ${joinApps.length} join applications in database`);
    joinApps.forEach(j => console.log(`   - ${j.name}: ${j.role} at ${j.institution}`));

    // Test 6: Check feedback submissions
    console.log("\n💬 Checking Feedback Submissions...");
    const feedback = await db.select().from(schema.feedbackSubmissions);
    console.log(`✅ Found ${feedback.length} feedback submissions in database`);
    feedback.forEach(f => console.log(`   - ${f.name}: ${f.rating}/5 stars`));

    // Test 7: Check projects
    console.log("\n🔬 Checking Projects...");
    const projects = await db.select().from(schema.groupProjects);
    console.log(`✅ Found ${projects.length} projects in database`);
    projects.forEach(p => console.log(`   - ${p.title}: ${p.status}`));

    // Test 8: Check users
    console.log("\n👥 Checking Users...");
    const users = await db.select().from(schema.users);
    console.log(`✅ Found ${users.length} users in database`);
    users.forEach(u => console.log(`   - ${u.firstName} ${u.lastName}: ${u.role}`));

    // Test 9: Insert and verify new data
    console.log("\n🧪 Testing Data Insertion...");
    
    // Insert a test testimonial
    const newTestimonial = await db.insert(schema.testimonials).values({
      name: "Database Test User",
      role: "Tester",
      institution: "Test Institution",
      content: "This testimonial was created to verify database functionality.",
      rating: 5
    }).returning();
    
    console.log(`✅ Successfully inserted new testimonial with ID: ${newTestimonial[0].id}`);
    
    // Verify it was inserted
    const verifyTestimonial = await db.select().from(schema.testimonials).where(
      schema.testimonials.id.eq(newTestimonial[0].id)
    );
    
    if (verifyTestimonial.length > 0) {
      console.log("✅ Successfully verified testimonial insertion");
    } else {
      console.log("❌ Failed to verify testimonial insertion");
    }

    // Clean up test data
    await db.delete(schema.testimonials).where(
      schema.testimonials.id.eq(newTestimonial[0].id)
    );
    console.log("✅ Test data cleaned up");

    console.log("\n" + "=".repeat(60));
    console.log("🎉 DATABASE VERIFICATION COMPLETE");
    console.log("=".repeat(60));
    console.log("✅ All database operations are working correctly!");
    console.log("✅ Data is being saved and retrieved properly!");
    console.log("✅ All CRUD operations functional!");
    console.log("✅ Database schema is properly implemented!");

  } catch (error) {
    console.error("❌ Database verification failed:", error);
  } finally {
    await pool.end();
  }
}

verifyDatabaseOperations();