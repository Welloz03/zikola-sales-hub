import { Request, Response } from 'express';
import Joi from 'joi';
import { DatabaseClient } from '../middleware/auth';

const prisma = DatabaseClient.getInstance();

export class ContractController {
  /**
   * Create new contract (Agent Flow)
   * Critical relational query: Contract Clause Compilation
   */
  static async createContract(req: Request, res: Response): Promise<void> {
    try {
      const { 
        client_name, 
        client_email, 
        client_phone, 
        package_id, 
        addon_ids = [],
        coupon_code 
      } = req.body;

      // Validate input
      const schema = Joi.object({
        client_name: Joi.string().min(2).required(),
        client_email: Joi.string().email().optional(),
        client_phone: Joi.string().optional(),
        package_id: Joi.string().required(),
        addon_ids: Joi.array().items(Joi.string()).optional(),
        coupon_code: Joi.string().optional()
      });

      const { error } = schema.validate({ 
        client_name, 
        client_email, 
        client_phone, 
        package_id, 
        addon_ids, 
        coupon_code 
      });
      
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      // Get package details
      const package_ = await prisma.package.findUnique({
        where: { package_id },
        include: {
          package_services: {
            include: {
              service: true
            }
          }
        }
      });

      if (!package_) {
        res.status(404).json({
          error: 'Package not found'
        });
        return;
      }

      // Contract Clause Compilation: Complex query to fetch clauses
      // Query Logic: SELECT clause_text FROM ContractClauses WHERE service_id IN ([package_service_ids]) AND duration_months = [package_duration] ORDER BY sort_order
      const serviceIds = package_.package_services.map(ps => ps.service_id);
      const contractClauses = await prisma.contractClause.findMany({
        where: {
          service_id: {
            in: serviceIds
          },
          duration_months: package_.duration_months
        },
        orderBy: { sort_order: 'asc' }
      });

      const clauseTexts = contractClauses.map(clause => clause.clause_text);

      // Calculate total amount
      let totalAmount = package_.total_price;

      // Add addon costs
      if (addon_ids.length > 0) {
        const addons = await prisma.addon.findMany({
          where: {
            addon_id: {
              in: addon_ids
            }
          }
        });

        addons.forEach(addon => {
          totalAmount = totalAmount.add(addon.price);
        });
      }

      // Apply coupon discount if provided
      if (coupon_code) {
        const coupon = await prisma.coupon.findUnique({
          where: { code: coupon_code }
        });

        if (coupon && coupon.is_active && (!coupon.expiry_date || coupon.expiry_date > new Date())) {
          if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            res.status(400).json({
              error: 'Coupon usage limit exceeded'
            });
            return;
          }

          // Apply discount (assuming percentage)
          const discountAmount = totalAmount.mul(coupon.discount_value).div(100);
          totalAmount = totalAmount.sub(discountAmount);

          // Update coupon usage count
          await prisma.coupon.update({
            where: { coupon_id: coupon.coupon_id },
            data: { used_count: coupon.used_count + 1 }
          });
        }
      }

      // Create contract with addons in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create contract
        const contract = await tx.contract.create({
          data: {
            client_name,
            client_email,
            client_phone,
            total_amount: totalAmount,
            contract_clauses: clauseTexts,
            sales_agent_id: req.user!.user_id,
            package_id
          }
        });

        // Create contract-addon relationships
        if (addon_ids.length > 0) {
          await tx.contractAddon.createMany({
            data: addon_ids.map((addon_id: string) => ({
              contract_id: contract.contract_id,
              addon_id,
              is_approved: false // Requires admin approval
            }))
          });
        }

        // Create initial audit log
        await tx.contractAuditLog.create({
          data: {
            contract_id: contract.contract_id,
            user_id: req.user!.user_id,
            action: 'contract_created',
            details: `Contract created for client: ${client_name}`
          }
        });

        return contract;
      });

      res.status(201).json({
        message: 'Contract created successfully',
        contract: {
          contract_id: result.contract_id,
          client_name: result.client_name,
          total_amount: result.total_amount,
          status: result.status,
          contract_clauses: result.contract_clauses
        }
      });
    } catch (error) {
      console.error('Create contract error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get all contracts (Admin: all, Agent: own contracts)
   */
  static async getContracts(req: Request, res: Response): Promise<void> {
    try {
      let contracts;

      if (req.user!.role === 'admin') {
        contracts = await prisma.contract.findMany({
          include: {
            sales_agent: {
              select: {
                user_id: true,
                name: true,
                email: true
              }
            },
            package: {
              select: {
                package_id: true,
                name: true,
                type: true
              }
            },
            contract_addons: {
              include: {
                addon: true
              }
            }
          },
          orderBy: { created_at: 'desc' }
        });
      } else {
        contracts = await prisma.contract.findMany({
          where: {
            sales_agent_id: req.user!.user_id
          },
          include: {
            package: {
              select: {
                package_id: true,
                name: true,
                type: true
              }
            },
            contract_addons: {
              include: {
                addon: true
              }
            }
          },
          orderBy: { created_at: 'desc' }
        });
      }

      res.json({
        contracts: contracts.map(contract => ({
          contract_id: contract.contract_id,
          client_name: contract.client_name,
          client_email: contract.client_email,
          client_phone: contract.client_phone,
          total_amount: contract.total_amount,
          status: contract.status,
          contract_clauses: contract.contract_clauses,
          sales_agent: contract.sales_agent ? {
            user_id: contract.sales_agent.user_id,
            name: contract.sales_agent.name,
            email: contract.sales_agent.email
          } : null,
          package: contract.package,
          addons: contract.contract_addons.map(ca => ({
            addon_id: ca.addon.addon_id,
            name: ca.addon.name,
            price: ca.addon.price,
            is_approved: ca.is_approved
          })),
          created_at: contract.created_at,
          updated_at: contract.updated_at
        }))
      });
    } catch (error) {
      console.error('Get contracts error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Update contract (Admin only)
   * Audit Trail Enforcement: Database Transaction
   */
  static async updateContract(req: Request, res: Response): Promise<void> {
    try {
      const { contract_id } = req.params;
      const { client_name, client_email, client_phone, status, contract_clauses } = req.body;

      // Validate input
      const schema = Joi.object({
        client_name: Joi.string().min(2).optional(),
        client_email: Joi.string().email().optional(),
        client_phone: Joi.string().optional(),
        status: Joi.string().valid('pending_review', 'approved', 'rejected', 'completed').optional(),
        contract_clauses: Joi.array().items(Joi.string()).optional()
      });

      const { error } = schema.validate({ 
        client_name, 
        client_email, 
        client_phone, 
        status, 
        contract_clauses 
      });
      
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      // Get current contract data for audit trail
      const currentContract = await prisma.contract.findUnique({
        where: { contract_id }
      });

      if (!currentContract) {
        res.status(404).json({
          error: 'Contract not found'
        });
        return;
      }

      // Audit Trail Enforcement: Database Transaction
      const result = await prisma.$transaction(async (tx) => {
        // Action 1: Update contract
        const updatedContract = await tx.contract.update({
          where: { contract_id },
          data: {
            ...(client_name && { client_name }),
            ...(client_email && { client_email }),
            ...(client_phone && { client_phone }),
            ...(status && { status }),
            ...(contract_clauses && { contract_clauses })
          }
        });

        // Action 2: Log changes in audit trail
        const changes = [];
        if (client_name && client_name !== currentContract.client_name) {
          changes.push(`Client name: ${currentContract.client_name} → ${client_name}`);
        }
        if (client_email && client_email !== currentContract.client_email) {
          changes.push(`Client email: ${currentContract.client_email} → ${client_email}`);
        }
        if (client_phone && client_phone !== currentContract.client_phone) {
          changes.push(`Client phone: ${currentContract.client_phone} → ${client_phone}`);
        }
        if (status && status !== currentContract.status) {
          changes.push(`Status: ${currentContract.status} → ${status}`);
        }
        if (contract_clauses && JSON.stringify(contract_clauses) !== JSON.stringify(currentContract.contract_clauses)) {
          changes.push('Contract clauses updated');
        }

        if (changes.length > 0) {
          await tx.contractAuditLog.create({
            data: {
              contract_id,
              user_id: req.user!.user_id,
              action: 'contract_updated',
              details: `Contract updated: ${changes.join(', ')}`
            }
          });
        }

        return updatedContract;
      });

      res.json({
        message: 'Contract updated successfully',
        contract: {
          contract_id: result.contract_id,
          client_name: result.client_name,
          client_email: result.client_email,
          client_phone: result.client_phone,
          status: result.status,
          contract_clauses: result.contract_clauses
        }
      });
    } catch (error) {
      console.error('Update contract error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get contract audit logs
   */
  static async getContractAuditLogs(req: Request, res: Response): Promise<void> {
    try {
      const { contract_id } = req.params;

      const auditLogs = await prisma.contractAuditLog.findMany({
        where: { contract_id },
        include: {
          user: {
            select: {
              user_id: true,
              name: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: { timestamp: 'desc' }
      });

      res.json({
        audit_logs: auditLogs.map(log => ({
          log_id: log.log_id,
          contract_id: log.contract_id,
          user: log.user,
          timestamp: log.timestamp,
          action: log.action,
          details: log.details
        }))
      });
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
