#!/bin/bash

echo "🚀 Setting up Zikola Sales Hub Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Please ensure PostgreSQL is installed."
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npm run db:generate

echo "📊 Setting up database..."
echo "Please ensure your PostgreSQL database is running and update the DATABASE_URL in .env file"
echo "Then run: npm run db:push"
echo "And finally: npm run db:seed"

echo "✅ Setup complete!"
echo "To start development server: npm run dev"
