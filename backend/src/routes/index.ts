import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { ServiceController } from '../controllers/serviceController';
import { PackageController } from '../controllers/packageController';
import { ContractController } from '../controllers/contractController';
import { ContractClauseController } from '../controllers/contractClauseController';
import { ReportController } from '../controllers/reportController';
import { AuthMiddleware, RoleMiddleware, ValidationMiddleware } from '../middleware/auth';
import { SecurityMiddleware } from '../middleware/security';
import Joi from 'joi';

const router = Router();

// Apply security middleware to all routes
router.use(SecurityMiddleware.cors());
router.use(SecurityMiddleware.helmet());
router.use(SecurityMiddleware.compression());

// Public routes
router.post('/auth/login', 
  SecurityMiddleware.authRateLimit(),
  ValidationMiddleware.validate(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })),
  AuthController.login
);

// Protected routes
router.use(AuthMiddleware.validateToken);

// Auth routes
router.post('/auth/register',
  RoleMiddleware.adminOnly,
  ValidationMiddleware.validate(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required(),
    role: Joi.string().valid('admin', 'agent').required(),
    company_id: Joi.string().required(),
    target_sales: Joi.number().positive().optional()
  })),
  AuthController.register
);

router.get('/auth/profile', AuthController.getProfile);

// Service routes
router.get('/services', 
  RoleMiddleware.adminOrAgent,
  ServiceController.getServices
);

router.post('/services',
  RoleMiddleware.adminOnly,
  ValidationMiddleware.validate(Joi.object({
    name: Joi.string().min(2).required(),
    monthly_cost: Joi.number().positive().required(),
    department: Joi.string().optional()
  })),
  ServiceController.createService
);

router.put('/services/:service_id',
  RoleMiddleware.adminOnly,
  ValidationMiddleware.validate(Joi.object({
    name: Joi.string().min(2).required(),
    monthly_cost: Joi.number().positive().required(),
    department: Joi.string().optional()
  })),
  ServiceController.updateService
);

router.delete('/services/:service_id',
  RoleMiddleware.adminOnly,
  ServiceController.deleteService
);

// Package routes
router.get('/packages',
  RoleMiddleware.adminOrAgent,
  PackageController.getPackages
);

router.post('/packages',
  RoleMiddleware.adminOnly,
  ValidationMiddleware.validate(Joi.object({
    name: Joi.string().min(2).required(),
    type: Joi.string().required(),
    duration_months: Joi.number().positive().required(),
    total_price: Joi.number().positive().required(),
    service_ids: Joi.array().items(Joi.string()).min(1).required()
  })),
  PackageController.createPackage
);

router.post('/packages/assign',
  RoleMiddleware.adminOnly,
  ValidationMiddleware.validate(Joi.object({
    package_id: Joi.string().required(),
    company_id: Joi.string().required()
  })),
  PackageController.assignPackageToCompany
);

// Contract Clause routes
router.get('/clauses',
  RoleMiddleware.adminOnly,
  ContractClauseController.getContractClauses
);

router.post('/clauses',
  RoleMiddleware.adminOnly,
  ValidationMiddleware.validate(Joi.object({
    clause_text: Joi.string().min(10).required(),
    duration_months: Joi.number().positive().required(),
    sort_order: Joi.number().integer().min(1).required(),
    service_id: Joi.string().required()
  })),
  ContractClauseController.createContractClause
);

router.put('/clauses/:clause_id',
  RoleMiddleware.adminOnly,
  ValidationMiddleware.validate(Joi.object({
    clause_text: Joi.string().min(10).optional(),
    duration_months: Joi.number().positive().optional(),
    sort_order: Joi.number().integer().min(1).optional(),
    service_id: Joi.string().optional()
  })),
  ContractClauseController.updateContractClause
);

router.delete('/clauses/:clause_id',
  RoleMiddleware.adminOnly,
  ContractClauseController.deleteContractClause
);

// Contract routes
router.post('/contracts',
  RoleMiddleware.agentOnly,
  ValidationMiddleware.validate(Joi.object({
    client_name: Joi.string().min(2).required(),
    client_email: Joi.string().email().optional(),
    client_phone: Joi.string().optional(),
    package_id: Joi.string().required(),
    addon_ids: Joi.array().items(Joi.string()).optional(),
    coupon_code: Joi.string().optional()
  })),
  ContractController.createContract
);

router.get('/contracts',
  RoleMiddleware.adminOrAgent,
  ContractController.getContracts
);

router.put('/contracts/:contract_id',
  RoleMiddleware.adminOnly,
  ValidationMiddleware.validate(Joi.object({
    client_name: Joi.string().min(2).optional(),
    client_email: Joi.string().email().optional(),
    client_phone: Joi.string().optional(),
    status: Joi.string().valid('pending_review', 'approved', 'rejected', 'completed').optional(),
    contract_clauses: Joi.array().items(Joi.string()).optional()
  })),
  ContractController.updateContract
);

router.get('/contracts/:contract_id/audit-logs',
  RoleMiddleware.adminOnly,
  ContractController.getContractAuditLogs
);

// Report routes
router.get('/reports/performance/:user_id',
  RoleMiddleware.adminOrAgent,
  ReportController.getPerformanceReport
);

router.get('/reports/company-performance',
  RoleMiddleware.adminOnly,
  ReportController.getCompanyPerformance
);

export default router;
