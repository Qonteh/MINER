const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '',
  host: 'localhost',
  port: 5432,
  database: 'mining_web',
});

async function initDb() {
  try {
    console.log('🔄 Initializing database...');
    
    // Drop existing tables
    console.log('Dropping existing tables...');
    await pool.query('DROP TABLE IF EXISTS sessions CASCADE;');
    await pool.query('DROP TABLE IF EXISTS admin_users CASCADE;');
    await pool.query('DROP TABLE IF EXISTS products CASCADE;');
    
    // Create admin_users table
    console.log('Creating admin_users table...');
    await pool.query(`
      CREATE TABLE admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create sessions table
    console.log('Creating sessions table...');
    await pool.query(`
      CREATE TABLE sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES admin_users(id),
        token VARCHAR(500) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create products table
    console.log('Creating products table...');
    await pool.query(`
      CREATE TABLE products (
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
    
    // Insert default admin user
    console.log('Creating default admin user...');
    await pool.query(
      'INSERT INTO admin_users (username, password, email) VALUES ($1, $2, $3);',
      ['admin', 'admin123', 'admin@mining.com']
    );
    
    console.log('✅ Database initialized successfully!');
    console.log('✅ Default user: admin / admin123');
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initDb();
