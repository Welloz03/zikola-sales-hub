import { Request, Response } from 'express';
import Joi from 'joi';
import { DatabaseClient } from '../middleware/auth';

const prisma = DatabaseClient.getInstance();

export class ContractClauseController {
  /**
   * Get all contract clauses (Admin only)
   */
  static async getContractClauses(req: Request, res: Response): Promise<void> {
    try {
      const clauses = await prisma.contractClause.findMany({
        include: {
          service: {
            select: {
              service_id: true,
              name: true,
              department: true
            }
          }
        },
        orderBy: [
          { service_id: 'asc' },
          { duration_months: 'asc' },
          { sort_order: 'asc' }
        ]
      });

      res.json({
        clauses: clauses.map(clause => ({
          clause_id: clause.clause_id,
          clause_text: clause.clause_text,
          duration_months: clause.duration_months,
          sort_order: clause.sort_order,
          service: clause.service,
          created_at: clause.created_at,
          updated_at: clause.updated_at
        }))
      });
    } catch (error) {
      console.error('Get contract clauses error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Create new contract clause (Admin only)
   */
  static async createContractClause(req: Request, res: Response): Promise<void> {
    try {
      const { clause_text, duration_months, sort_order, service_id } = req.body;

      // Validate input
      const schema = Joi.object({
        clause_text: Joi.string().min(10).required(),
        duration_months: Joi.number().positive().required(),
        sort_order: Joi.number().integer().min(1).required(),
        service_id: Joi.string().required()
      });

      const { error } = schema.validate({ clause_text, duration_months, sort_order, service_id });
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      // Verify service exists
      const service = await prisma.service.findUnique({
        where: { service_id }
      });

      if (!service) {
        res.status(404).json({
          error: 'Service not found'
        });
        return;
      }

      const clause = await prisma.contractClause.create({
        data: {
          clause_text,
          duration_months: parseInt(duration_months.toString()),
          sort_order: parseInt(sort_order.toString()),
          service_id
        },
        include: {
          service: {
            select: {
              service_id: true,
              name: true,
              department: true
            }
          }
        }
      });

      res.status(201).json({
        message: 'Contract clause created successfully',
        clause: {
          clause_id: clause.clause_id,
          clause_text: clause.clause_text,
          duration_months: clause.duration_months,
          sort_order: clause.sort_order,
          service: clause.service
        }
      });
    } catch (error) {
      console.error('Create contract clause error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Update contract clause (Admin only)
   */
  static async updateContractClause(req: Request, res: Response): Promise<void> {
    try {
      const { clause_id } = req.params;
      const { clause_text, duration_months, sort_order, service_id } = req.body;

      // Validate input
      const schema = Joi.object({
        clause_text: Joi.string().min(10).optional(),
        duration_months: Joi.number().positive().optional(),
        sort_order: Joi.number().integer().min(1).optional(),
        service_id: Joi.string().optional()
      });

      const { error } = schema.validate({ clause_text, duration_months, sort_order, service_id });
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      const clause = await prisma.contractClause.update({
        where: { clause_id },
        data: {
          ...(clause_text && { clause_text }),
          ...(duration_months && { duration_months: parseInt(duration_months.toString()) }),
          ...(sort_order && { sort_order: parseInt(sort_order.toString()) }),
          ...(service_id && { service_id })
        },
        include: {
          service: {
            select: {
              service_id: true,
              name: true,
              department: true
            }
          }
        }
      });

      res.json({
        message: 'Contract clause updated successfully',
        clause: {
          clause_id: clause.clause_id,
          clause_text: clause.clause_text,
          duration_months: clause.duration_months,
          sort_order: clause.sort_order,
          service: clause.service
        }
      });
    } catch (error) {
      console.error('Update contract clause error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Delete contract clause (Admin only)
   */
  static async deleteContractClause(req: Request, res: Response): Promise<void> {
    try {
      const { clause_id } = req.params;

      await prisma.contractClause.delete({
        where: { clause_id }
      });

      res.json({
        message: 'Contract clause deleted successfully'
      });
    } catch (error) {
      console.error('Delete contract clause error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
