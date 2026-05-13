#!/bin/bash

# Mining Web - Automatic Setup Script
# This script sets up the database and initializes all tables

echo "🚀 Mining Web - Database Setup Starting..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "📋 Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "✅ .env.local created - please update with your database credentials"
fi

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL connection..."
node -e "
const { testConnection } = require('./lib/db.ts');
testConnection().then(connected => {
  if (connected) {
    console.log('✅ Database connection successful!');
  } else {
    console.log('❌ Could not connect to database');
    process.exit(1);
  }
});
"

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🗄️ Initializing database tables..."
curl -X POST http://localhost:3003/api/db/init

echo ""
echo "✨ Setup complete!"
echo "🌐 Start the development server: pnpm dev"
echo "🔐 Visit admin panel: http://localhost:3003/admin/login"
echo "📝 Default credentials - Username: admin, Password: admin123"
