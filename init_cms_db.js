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
    console.log('🔄 Initializing CMS database...');
    
    // Drop existing tables
    console.log('Dropping existing tables...');
    await pool.query('DROP TABLE IF EXISTS contact_submissions CASCADE;');
    await pool.query('DROP TABLE IF EXISTS page_sections CASCADE;');
    await pool.query('DROP TABLE IF EXISTS website_settings CASCADE;');
    await pool.query('DROP TABLE IF EXISTS sessions CASCADE;');
    await pool.query('DROP TABLE IF EXISTS admin_users CASCADE;');
    
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
    
    // Create website_settings table
    console.log('Creating website_settings table...');
    await pool.query(`
      CREATE TABLE website_settings (
        id SERIAL PRIMARY KEY,
        site_title VARCHAR(255),
        site_description TEXT,
        primary_color VARCHAR(7),
        secondary_color VARCHAR(7),
        accent_color VARCHAR(7),
        logo_url VARCHAR(500),
        favicon_url VARCHAR(500),
        font_family VARCHAR(255),
        company_email VARCHAR(255),
        company_phone VARCHAR(20),
        company_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create page_sections table
    console.log('Creating page_sections table...');
    await pool.query(`
      CREATE TABLE page_sections (
        id SERIAL PRIMARY KEY,
        section_name VARCHAR(100) NOT NULL,
        section_key VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(500),
        subtitle VARCHAR(500),
        description TEXT,
        image_url VARCHAR(500),
        button_text VARCHAR(100),
        button_url VARCHAR(500),
        content JSON,
        is_visible BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create contact_submissions table
    console.log('Creating contact_submissions table...');
    await pool.query(`
      CREATE TABLE contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        company VARCHAR(255),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        replied_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Insert default admin user
    console.log('Creating default admin user...');
    await pool.query(
      'INSERT INTO admin_users (username, password, email) VALUES ($1, $2, $3);',
      ['admin', 'admin123', 'admin@gemora.com']
    );
    
    // Insert default website settings
    console.log('Creating default website settings...');
    await pool.query(`
      INSERT INTO website_settings (
        site_title,
        site_description,
        primary_color,
        secondary_color,
        accent_color,
        font_family,
        company_email,
        company_phone,
        company_address
      ) VALUES (
        'AXXEN International - Premium Global Mineral Solutions',
        'Trusted mineral dealer delivering premium quality minerals with integrity, reliability, and global excellence.',
        '#2563eb',
        '#1e40af',
        '#f59e0b',
        'Inter, sans-serif',
        'info@axxeninternational.com',
        '+1 (800) 123-4567',
        '123 Mineral Plaza, Global City, GC 12345'
      );
    `);
    
    // Insert default page sections
    console.log('Creating default page sections...');
    const sections = [
      { name: 'Hero', key: 'hero', title: 'CONNECTING MINERALS. POWERING POSSIBILITIES.', subtitle: 'GLOBAL MINERAL SOLUTIONS' },
      { name: 'About', key: 'about', title: 'ABOUT AXXEN INTERNATIONAL', subtitle: 'Who We Are' },
      { name: 'Services', key: 'services', title: 'OUR SERVICES', subtitle: 'What We Offer' },
      { name: 'Minerals', key: 'minerals', title: 'PREMIUM MINERALS', subtitle: 'Our Catalog' },
      { name: 'Global Reach', key: 'global-reach', title: 'GLOBAL REACH', subtitle: 'Worldwide Presence' },
      { name: 'Contact', key: 'contact', title: 'GET IN TOUCH', subtitle: 'Contact Us' },
    ];
    
    for (const section of sections) {
      await pool.query(
        `INSERT INTO page_sections (section_name, section_key, title, subtitle, is_visible, order_index)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [section.name, section.key, section.title, section.subtitle, true, sections.indexOf(section)]
      );
    }
    
    console.log('✅ CMS Database initialized successfully!');
    console.log('✅ Default user: admin / admin123');
    console.log('✅ Page sections created and ready for editing');
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initDb();
