import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Create admin_users table
    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create sessions table
    await query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES admin_users(id),
        token VARCHAR(500) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create products table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        price DECIMAL(10, 2),
        stock_quantity INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Hash passwords for admin users
    const eugenePassword = await bcrypt.hash('eugene051@', 10);
    const abdulPassword = await bcrypt.hash('Qontetina051@', 10);

    // Create admin user 1: Eugene
    await query(`
      INSERT INTO admin_users (username, password, email)
      VALUES ('eugene', $1, 'eugene@gmail.com')
      ON CONFLICT (username) DO UPDATE SET password = $1, email = 'eugene@gmail.com';
    `, [eugenePassword]);

    // Create admin user 2: Abdul
    await query(`
      INSERT INTO admin_users (username, password, email)
      VALUES ('abdulyusuph', $1, 'abdulyusuph051@gmail.com')
      ON CONFLICT (username) DO UPDATE SET password = $1, email = 'abdulyusuph051@gmail.com';
    `, [abdulPassword]);

    // Delete old demo admin user if exists
    await query(`
      DELETE FROM admin_users WHERE username = 'admin' AND email = 'admin@mining.com';
    `);

    return NextResponse.json(
      { status: 'success', message: 'Database tables initialized successfully with admin users' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { status: 'error', message: String(error) },
      { status: 500 }
    );
  }
}
