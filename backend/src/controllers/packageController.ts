import { Request, Response } from 'express';
import Joi from 'joi';
import { DatabaseClient } from '../middleware/auth';

const prisma = DatabaseClient.getInstance();

export class PackageController {
  /**
   * Get packages (Admin: all, Agent: filtered by company)
   * Critical relational query: JOIN across Users, Companies, and CompanyPackages
   */
  static async getPackages(req: Request, res: Response): Promise<void> {
    try {
      let packages;

      if (req.user!.role === 'admin') {
        // Admin can see all packages with their services
        packages = await prisma.package.findMany({
          include: {
            package_services: {
              include: {
                service: true
              }
            }
          },
          orderBy: { name: 'asc' }
        });
      } else {
        // Agent Package Filtering: Complex JOIN query
        // Query Logic: SELECT p.* FROM Packages p JOIN CompanyPackages cp ON p.package_id = cp.package_id WHERE cp.company_id = [req.user.company_id]
        packages = await prisma.package.findMany({
          where: {
            company_packages: {
              some: {
                company_id: req.user!.company_id
              }
            }
          },
          include: {
            package_services: {
              include: {
                service: true
              }
            }
          },
          orderBy: { name: 'asc' }
        });
      }

      res.json({
        packages: packages.map(pkg => ({
          package_id: pkg.package_id,
          name: pkg.name,
          type: pkg.type,
          duration_months: pkg.duration_months,
          total_price: pkg.total_price,
          services: pkg.package_services.map(ps => ({
            service_id: ps.service.service_id,
            name: ps.service.name,
            monthly_cost: ps.service.monthly_cost,
            department: ps.service.department
          }))
        }))
      });
    } catch (error) {
      console.error('Get packages error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Create new package (Admin only)
   */
  static async createPackage(req: Request, res: Response): Promise<void> {
    try {
      const { name, type, duration_months, total_price, service_ids } = req.body;

      // Validate input
      const schema = Joi.object({
        name: Joi.string().min(2).required(),
        type: Joi.string().required(),
        duration_months: Joi.number().positive().required(),
        total_price: Joi.number().positive().required(),
        service_ids: Joi.array().items(Joi.string()).min(1).required()
      });

      const { error } = schema.validate({ name, type, duration_months, total_price, service_ids });
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      // Create package with services in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create package
        const package_ = await tx.package.create({
          data: {
            name,
            type,
            duration_months: parseInt(duration_months.toString()),
            total_price: parseFloat(total_price.toString())
          }
        });

        // Create package-service relationships
        await tx.packageService.createMany({
          data: service_ids.map((service_id: string) => ({
            package_id: package_.package_id,
            service_id
          }))
        });

        return package_;
      });

      res.status(201).json({
        message: 'Package created successfully',
        package: {
          package_id: result.package_id,
          name: result.name,
          type: result.type,
          duration_months: result.duration_months,
          total_price: result.total_price
        }
      });
    } catch (error) {
      console.error('Create package error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Assign package to company (Admin only)
   */
  static async assignPackageToCompany(req: Request, res: Response): Promise<void> {
    try {
      const { package_id, company_id } = req.body;

      // Validate input
      const schema = Joi.object({
        package_id: Joi.string().required(),
        company_id: Joi.string().required()
      });

      const { error } = schema.validate({ package_id, company_id });
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      const companyPackage = await prisma.companyPackage.create({
        data: {
          package_id,
          company_id
        }
      });

      res.status(201).json({
        message: 'Package assigned to company successfully',
        company_package: {
          comp_pkg_id: companyPackage.comp_pkg_id,
          package_id: companyPackage.package_id,
          company_id: companyPackage.company_id
        }
      });
    } catch (error) {
      console.error('Assign package error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
