import { Request, Response } from 'express';
import Joi from 'joi';
import { DatabaseClient } from '../middleware/auth';

const prisma = DatabaseClient.getInstance();

export class ReportController {
  /**
   * Get performance report for a specific user
   * Performance Report: Complex Aggregate Query with JOINs
   */
  static async getPerformanceReport(req: Request, res: Response): Promise<void> {
    try {
      const { user_id } = req.params;

      // Validate user access
      if (req.user!.role === 'agent' && req.user!.user_id !== user_id) {
        res.status(403).json({
          error: 'Access denied. You can only view your own performance report.'
        });
        return;
      }

      // Performance Report: Aggregate Query with JOINs on Contracts and Users tables
      const user = await prisma.user.findUnique({
        where: { user_id },
        include: {
          company: true,
          contracts_created: {
            where: {
              status: {
                in: ['approved', 'completed']
              }
            }
          }
        }
      });

      if (!user) {
        res.status(404).json({
          error: 'User not found'
        });
        return;
      }

      // Calculate performance metrics
      const totalRevenue = user.contracts_created.reduce((sum, contract) => {
        return sum.add(contract.total_amount);
      }, 0);

      const contractsCount = user.contracts_created.length;
      const targetSales = user.target_sales || 0;
      const achievementPercentage = targetSales > 0 
        ? (totalRevenue.toNumber() / targetSales.toNumber()) * 100 
        : 0;

      // Get monthly performance data
      const monthlyData = await prisma.contract.groupBy({
        by: ['created_at'],
        where: {
          sales_agent_id: user_id,
          status: {
            in: ['approved', 'completed']
          }
        },
        _sum: {
          total_amount: true
        },
        _count: {
          contract_id: true
        }
      });

      // Get contract status distribution
      const statusDistribution = await prisma.contract.groupBy({
        by: ['status'],
        where: {
          sales_agent_id: user_id
        },
        _count: {
          contract_id: true
        }
      });

      res.json({
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company.name,
          target_sales: user.target_sales
        },
        performance: {
          total_revenue: totalRevenue.toNumber(),
          contracts_count: contractsCount,
          target_sales: targetSales.toNumber(),
          achievement_percentage: Math.round(achievementPercentage * 100) / 100,
          monthly_data: monthlyData.map(data => ({
            month: data.created_at.toISOString().substring(0, 7), // YYYY-MM
            revenue: data._sum.total_amount?.toNumber() || 0,
            contracts_count: data._count.contract_id
          })),
          status_distribution: statusDistribution.map(status => ({
            status: status.status,
            count: status._count.contract_id
          }))
        }
      });
    } catch (error) {
      console.error('Get performance report error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get company performance overview (Admin only)
   */
  static async getCompanyPerformance(req: Request, res: Response): Promise<void> {
    try {
      const companies = await prisma.company.findMany({
        include: {
          users: {
            where: {
              role: 'agent',
              is_active: true
            },
            include: {
              contracts_created: {
                where: {
                  status: {
                    in: ['approved', 'completed']
                  }
                }
              }
            }
          }
        }
      });

      const companyPerformance = companies.map(company => {
        const agents = company.users;
        const totalRevenue = agents.reduce((sum, agent) => {
          const agentRevenue = agent.contracts_created.reduce((agentSum, contract) => {
            return agentSum.add(contract.total_amount);
          }, 0);
          return sum.add(agentRevenue);
        }, 0);

        const totalContracts = agents.reduce((sum, agent) => {
          return sum + agent.contracts_created.length;
        }, 0);

        return {
          company_id: company.company_id,
          company_name: company.name,
          agents_count: agents.length,
          total_revenue: totalRevenue.toNumber(),
          total_contracts: totalContracts,
          average_revenue_per_agent: agents.length > 0 ? totalRevenue.div(agents.length).toNumber() : 0
        };
      });

      res.json({
        company_performance: companyPerformance
      });
    } catch (error) {
      console.error('Get company performance error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
