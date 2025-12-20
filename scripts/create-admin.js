import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '../shared/schema.js';

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/gireach';
const sql = postgres(connectionString);
const db = drizzle(sql);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Create admin user
    const adminUser = {
      email: 'admin@gireach.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      institution: 'GI REACH',
      isActive: true
    };
    
    // Insert user (will fail if email already exists)
    const [user] = await db.insert(users).values(adminUser).returning();
    
    console.log('Admin user created successfully:');
    console.log('Email:', user.email);
    console.log('Password: admin123');
    console.log('Role:', user.role);
    
  } catch (error) {
    if (error.message.includes('duplicate key')) {
      console.log('Admin user already exists with email: admin@gireach.com');
    } else {
      console.error('Error creating admin user:', error);
    }
  } finally {
    await sql.end();
  }
}

createAdminUser();