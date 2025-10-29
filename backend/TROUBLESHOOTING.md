# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Cannot find module 'express' or its corresponding type declarations"

**Solution:**
```bash
cd backend
npm install
```

If the issue persists:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### 2. "Cannot find module 'joi' or its corresponding type declarations"

**Solution:**
```bash
npm install joi @types/joi
```

### 3. "Parameter 'pkg' implicitly has an 'any' type"

**Solution:**
- Fixed in seed.ts by adding proper TypeScript types
- Set `"noImplicitAny": false` in tsconfig.json for development

### 4. Prisma Client Issues

**Solution:**
```bash
# Generate Prisma client
npm run db:generate

# If schema changed, push to database
npm run db:push
```

### 5. Database Connection Issues

**Solution:**
1. Ensure PostgreSQL is running
2. Update DATABASE_URL in .env file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/zikola_sales_hub?schema=public"
   ```
3. Create the database if it doesn't exist:
   ```sql
   CREATE DATABASE zikola_sales_hub;
   ```

### 6. TypeScript Compilation Issues

**Solution:**
```bash
# Clean and rebuild
npm run build

# Or run with transpile-only for development
npm run dev
```

### 7. Module Resolution Issues

**Solution:**
- Ensure tsconfig.json has correct moduleResolution
- Check that all dependencies are installed
- Verify import paths are correct

## Quick Setup Commands

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Generate Prisma client
npm run db:generate

# 3. Set up database (update .env first)
npm run db:push

# 4. Seed database
npm run db:seed

# 5. Start development server
npm run dev
```

## Environment Variables Required

Create `.env` file in backend directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/zikola_sales_hub?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```
