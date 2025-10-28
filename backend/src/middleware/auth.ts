import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        email: string;
        role: 'admin' | 'agent';
        company_id: string;
        name: string;
      };
    }
  }
}

export interface JWTPayload {
  user_id: string;
  email: string;
  role: 'admin' | 'agent';
  company_id: string;
}

export class AuthMiddleware {
  /**
   * Validates JWT token and retrieves user data from database
   */
  static async validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ 
          error: 'Access denied. No token provided.' 
        });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const jwtSecret = process.env.JWT_SECRET;
      
      if (!jwtSecret) {
        res.status(500).json({ 
          error: 'Server configuration error' 
        });
        return;
      }

      // Verify JWT token
      const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
      
      // Fetch user data from database
      const user = await prisma.user.findUnique({
        where: { user_id: decoded.user_id },
        include: {
          company: true
        }
      });

      if (!user || !user.is_active) {
        res.status(401).json({ 
          error: 'Invalid token or user not found' 
        });
        return;
      }

      // Attach user data to request
      req.user = {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
        name: user.name
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ 
          error: 'Invalid token' 
        });
      } else {
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
          error: 'Internal server error' 
        });
      }
    }
  }
}

export class RoleMiddleware {
  /**
   * Enforces Role-Based Access Control (RBAC)
   */
  static requireRole(allowedRoles: ('admin' | 'agent')[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ 
          error: 'Authentication required' 
        });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({ 
          error: 'Insufficient permissions' 
        });
        return;
      }

      next();
    };
  }

  /**
   * Admin only access
   */
  static adminOnly(req: Request, res: Response, next: NextFunction): void {
    RoleMiddleware.requireRole(['admin'])(req, res, next);
  }

  /**
   * Agent only access
   */
  static agentOnly(req: Request, res: Response, next: NextFunction): void {
    RoleMiddleware.requireRole(['agent'])(req, res, next);
  }

  /**
   * Both admin and agent access
   */
  static adminOrAgent(req: Request, res: Response, next: NextFunction): void {
    RoleMiddleware.requireRole(['admin', 'agent'])(req, res, next);
  }
}

export class DatabaseClient {
  private static instance: PrismaClient;

  /**
   * Get singleton Prisma client instance
   */
  static getInstance(): PrismaClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      });
    }
    return DatabaseClient.instance;
  }

  /**
   * Close database connection
   */
  static async disconnect(): Promise<void> {
    if (DatabaseClient.instance) {
      await DatabaseClient.instance.$disconnect();
    }
  }
}

export class ValidationMiddleware {
  /**
   * Validate request body against Joi schema
   */
  static validate(schema: any) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error } = schema.validate(req.body);
      
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map((detail: any) => detail.message)
        });
        return;
      }
      
      next();
    };
  }
}

export class ErrorHandler {
  /**
   * Global error handler middleware
   */
  static handle(error: Error, req: Request, res: Response, next: NextFunction): void {
    console.error('Error:', error);

    if (error.name === 'ValidationError') {
      res.status(400).json({
        error: 'Validation error',
        message: error.message
      });
      return;
    }

    if (error.name === 'UnauthorizedError') {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid credentials'
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
