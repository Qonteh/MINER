#!/usr/bin/env python3
import psycopg2
import sys

try:
    # Connect to database
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="mining_web",
        user="postgres",
        password=""
    )
    
    cursor = conn.cursor()
    
    # Drop existing tables to start fresh
    cursor.execute("DROP TABLE IF EXISTS sessions CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS admin_users CASCADE;")
    cursor.execute("DROP TABLE IF EXISTS products CASCADE;")
    
    # Create admin_users table
    cursor.execute("""
        CREATE TABLE admin_users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Create sessions table
    cursor.execute("""
        CREATE TABLE sessions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES admin_users(id),
            token VARCHAR(500) UNIQUE NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Create products table
    cursor.execute("""
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
    """)
    
    # Insert default admin user
    cursor.execute("""
        INSERT INTO admin_users (username, password, email)
        VALUES ('admin', 'admin123', 'admin@mining.com');
    """)
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print("✓ Database initialized successfully!")
    print("✓ Default user created - username: admin, password: admin123")
    
except Exception as e:
    print(f"✗ Error: {e}")
    sys.exit(1)
