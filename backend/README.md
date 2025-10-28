# Zikola Sales Hub Backend

A robust Node.js backend API built with Express, TypeScript, and PostgreSQL for the Zikola Sales Hub application.

## 🏗️ Architecture

- **Platform**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with Role-Based Access Control (RBAC)
- **Security**: Helmet, CORS, Rate Limiting, Input Validation

## 📊 Database Schema

### Core Tables

- **Users**: User accounts with roles (admin/agent) and company associations
- **Companies**: Company entities that agents belong to
- **Services**: Individual services offered
- **Packages**: Service bundles with pricing and duration
- **Contracts**: Sales contracts with automatic clause compilation
- **ContractClauses**: Template clauses linked to services and durations
- **ContractAuditLogs**: Complete audit trail for contract modifications

### Key Relationships

- Users belong to Companies (1:Many)
- Packages contain Services (Many:Many via PackageServices)
- Companies can access Packages (Many:Many via CompanyPackages)
- Contracts link Users, Packages, and automatically compiled Clauses
- All contract changes are logged in ContractAuditLogs

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔐 Authentication & Authorization

### JWT Authentication
- Login endpoint: `POST /api/auth/login`
- JWT tokens expire in 7 days (configurable)
- All protected routes require `Authorization: Bearer <token>` header

### Role-Based Access Control
- **Admin**: Full access to all resources
- **Agent**: Limited to own company's packages and contracts

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile

### Services
- `GET /api/services` - Get services (admin: all, agent: company-filtered)
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Packages
- `GET /api/packages` - Get packages (admin: all, agent: company-filtered)
- `POST /api/packages` - Create package (admin only)
- `POST /api/packages/assign` - Assign package to company (admin only)

### Contracts
- `POST /api/contracts` - Create contract (agent only)
- `GET /api/contracts` - Get contracts (admin: all, agent: own)
- `PUT /api/contracts/:id` - Update contract (admin only)
- `GET /api/contracts/:id/audit-logs` - Get audit logs (admin only)

### Reports
- `GET /api/reports/performance/:user_id` - Performance report
- `GET /api/reports/company-performance` - Company overview (admin only)

## 🔍 Critical Relational Queries

### 1. Agent Package Filtering
```sql
SELECT p.* FROM Packages p 
JOIN CompanyPackages cp ON p.package_id = cp.package_id 
WHERE cp.company_id = [user.company_id]
```

### 2. Contract Clause Compilation
```sql
SELECT clause_text FROM ContractClauses 
WHERE service_id IN ([package_service_ids]) 
AND duration_months = [package_duration] 
ORDER BY sort_order
```

### 3. Audit Trail Enforcement
```sql
-- Transaction: Update contract + Log changes
BEGIN;
UPDATE Contracts SET ... WHERE contract_id = ?;
INSERT INTO ContractAuditLogs (contract_id, user_id, timestamp, details) VALUES (...);
COMMIT;
```

### 4. Performance Aggregation
```sql
-- Complex JOINs for performance metrics
SELECT SUM(total_amount), COUNT(contract_id) 
FROM Contracts c 
JOIN Users u ON c.sales_agent_id = u.user_id 
WHERE u.user_id = ? AND c.status IN ('approved', 'completed')
```

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Signed tokens with expiration

## 📝 Database Migrations

```bash
# Create new migration
npm run db:migrate

# Reset database
npx prisma migrate reset

# View database in Prisma Studio
npm run db:studio
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📊 Monitoring

- Health check: `GET /health`
- Request logging for all endpoints
- Error tracking with stack traces
- Database query logging in development

## 🔧 Configuration

Environment variables in `.env`:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/zikola_sales_hub"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
```

## 📈 Performance Considerations

- Database connection pooling via Prisma
- Efficient JOIN queries for complex relationships
- Transaction-based operations for data consistency
- Proper indexing on foreign keys and unique fields
- Compression middleware for response optimization

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

4. **Start production server**
   ```bash
   npm start
   ```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
