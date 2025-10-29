import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import Joi from 'joi';
import { DatabaseClient } from '../middleware/auth';

const prisma = DatabaseClient.getInstance();

export class AuthController {
  /**
   * Login endpoint
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate input
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
      });

      const { error } = schema.validate({ email, password });
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          company: true
        }
      });

      if (!user || !user.is_active) {
        res.status(401).json({
          error: 'Invalid credentials'
        });
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        res.status(401).json({
          error: 'Invalid credentials'
        });
        return;
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET;
      const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

      if (!jwtSecret) {
        res.status(500).json({
          error: 'Server configuration error'
        });
        return;
      }

      const token = jwt.sign(
        {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          company_id: user.company_id
        },
        jwtSecret,
        { 
          expiresIn: jwtExpiresIn,
          algorithm: 'HS256'
        } as SignOptions
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          name: user.name,
          company: user.company.name
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Register endpoint (Admin only)
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, role, company_id, target_sales } = req.body;

      // Validate input
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().min(2).required(),
        role: Joi.string().valid('admin', 'agent').required(),
        company_id: Joi.string().required(),
        target_sales: Joi.number().positive().optional()
      });

      const { error } = schema.validate({ email, password, name, role, company_id, target_sales });
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        res.status(409).json({
          error: 'User already exists'
        });
        return;
      }

      // Hash password
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password_hash,
          name,
          role: role as 'admin' | 'agent',
          company_id,
          target_sales: target_sales ? parseFloat(target_sales.toString()) : null
        },
        include: {
          company: true
        }
      });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          name: user.name,
          company: user.company.name
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: req.user!.user_id },
        include: {
          company: true
        }
      });

      if (!user) {
        res.status(404).json({
          error: 'User not found'
        });
        return;
      }

      res.json({
        user: {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          name: user.name,
          target_sales: user.target_sales,
          company: user.company.name,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
