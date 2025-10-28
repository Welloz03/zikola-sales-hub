@echo off
echo 🚀 Setting up Zikola Sales Hub Backend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
npm install

echo 🔧 Generating Prisma client...
npm run db:generate

echo 📊 Setting up database...
echo Please ensure your PostgreSQL database is running and update the DATABASE_URL in .env file
echo Then run: npm run db:push
echo And finally: npm run db:seed

echo ✅ Setup complete!
echo To start development server: npm run dev
pause
