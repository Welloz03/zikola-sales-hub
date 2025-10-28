import { Request, Response } from 'express';
import Joi from 'joi';
import { DatabaseClient } from '../middleware/auth';

const prisma = DatabaseClient.getInstance();

export class ServiceController {
  /**
   * Get all services (Admin: all, Agent: filtered by company packages)
   */
  static async getServices(req: Request, res: Response): Promise<void> {
    try {
      let services;

      if (req.user!.role === 'admin') {
        // Admin can see all services
        services = await prisma.service.findMany({
          orderBy: { name: 'asc' }
        });
      } else {
        // Agent can only see services from their company's packages
        services = await prisma.service.findMany({
          where: {
            package_services: {
              some: {
                package: {
                  company_packages: {
                    some: {
                      company_id: req.user!.company_id
                    }
                  }
                }
              }
            }
          },
          orderBy: { name: 'asc' }
        });
      }

      res.json({
        services: services.map(service => ({
          service_id: service.service_id,
          name: service.name,
          monthly_cost: service.monthly_cost,
          department: service.department
        }))
      });
    } catch (error) {
      console.error('Get services error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Create new service (Admin only)
   */
  static async createService(req: Request, res: Response): Promise<void> {
    try {
      const { name, monthly_cost, department } = req.body;

      // Validate input
      const schema = Joi.object({
        name: Joi.string().min(2).required(),
        monthly_cost: Joi.number().positive().required(),
        department: Joi.string().optional()
      });

      const { error } = schema.validate({ name, monthly_cost, department });
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      const service = await prisma.service.create({
        data: {
          name,
          monthly_cost: parseFloat(monthly_cost.toString()),
          department
        }
      });

      res.status(201).json({
        message: 'Service created successfully',
        service: {
          service_id: service.service_id,
          name: service.name,
          monthly_cost: service.monthly_cost,
          department: service.department
        }
      });
    } catch (error) {
      console.error('Create service error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Update service (Admin only)
   */
  static async updateService(req: Request, res: Response): Promise<void> {
    try {
      const { service_id } = req.params;
      const { name, monthly_cost, department } = req.body;

      // Validate input
      const schema = Joi.object({
        name: Joi.string().min(2).required(),
        monthly_cost: Joi.number().positive().required(),
        department: Joi.string().optional()
      });

      const { error } = schema.validate({ name, monthly_cost, department });
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      const service = await prisma.service.update({
        where: { service_id },
        data: {
          name,
          monthly_cost: parseFloat(monthly_cost.toString()),
          department
        }
      });

      res.json({
        message: 'Service updated successfully',
        service: {
          service_id: service.service_id,
          name: service.name,
          monthly_cost: service.monthly_cost,
          department: service.department
        }
      });
    } catch (error) {
      console.error('Update service error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Delete service (Admin only)
   */
  static async deleteService(req: Request, res: Response): Promise<void> {
    try {
      const { service_id } = req.params;

      await prisma.service.delete({
        where: { service_id }
      });

      res.json({
        message: 'Service deleted successfully'
      });
    } catch (error) {
      console.error('Delete service error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
