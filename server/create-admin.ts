import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin@fourkids.com'));
    
    if (existingAdmin.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = {
      email: 'admin@fourkids.com',
      password: 'admin123',
      name: 'Admin User',
      businessName: 'Four Kids',
      phoneNumber: '1234567890',
      address: 'Admin Address',
      role: 'admin',
      gstin: null
    };

    await db.insert(users).values(adminUser);
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await pool.end();
  }
}

createAdminUser(); 