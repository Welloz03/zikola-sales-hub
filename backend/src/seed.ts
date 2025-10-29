import { PrismaClient, Company, User, Service, Package } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create companies
  const companies: Company[] = await Promise.all([
    prisma.company.create({
      data: {
        name: 'زيكولا الرئيسي',
        description: 'الشركة الرئيسية لزيكولا',
        contact_email: 'main@zikola.com'
      }
    }),
    prisma.company.create({
      data: {
        name: 'زيكولا الرياض',
        description: 'فرع الرياض',
        contact_email: 'riyadh@zikola.com'
      }
    }),
    prisma.company.create({
      data: {
        name: 'زيكولا جدة',
        description: 'فرع جدة',
        contact_email: 'jeddah@zikola.com'
      }
    })
  ]);

  console.log('✅ Companies created');

  // Create users
  const passwordHash = await bcrypt.hash('password123', 12);

  const users: User[] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@zikola.com',
        password_hash: passwordHash,
        role: 'admin',
        name: 'أحمد محمد',
        company_id: companies[0].company_id,
        target_sales: 1000000
      }
    }),
    prisma.user.create({
      data: {
        email: 'khaled@zikola.com',
        password_hash: passwordHash,
        role: 'agent',
        name: 'خالد أحمد',
        company_id: companies[0].company_id,
        target_sales: 500000
      }
    }),
    prisma.user.create({
      data: {
        email: 'sara@zikola.com',
        password_hash: passwordHash,
        role: 'agent',
        name: 'سارة محمد',
        company_id: companies[1].company_id,
        target_sales: 400000
      }
    })
  ]);

  console.log('✅ Users created');

  // Create services
  const services: Service[] = await Promise.all([
    prisma.service.create({
      data: {
        name: 'تطوير تطبيق أصلي',
        monthly_cost: 15000,
        department: 'تطوير'
      }
    }),
    prisma.service.create({
      data: {
        name: 'خدمات SEO',
        monthly_cost: 5000,
        department: 'تسويق'
      }
    }),
    prisma.service.create({
      data: {
        name: 'إدارة وسائل التواصل الاجتماعي',
        monthly_cost: 3000,
        department: 'تسويق'
      }
    }),
    prisma.service.create({
      data: {
        name: 'تطوير ويب',
        monthly_cost: 8000,
        department: 'تطوير'
      }
    }),
    prisma.service.create({
      data: {
        name: 'تسويق رقمي شامل',
        monthly_cost: 12000,
        department: 'تسويق'
      }
    })
  ]);

  console.log('✅ Services created');

  // Create packages
  const packages: Package[] = await Promise.all([
    prisma.package.create({
      data: {
        name: 'الباقة الذهبية - تسويق متكامل',
        type: 'تسويق',
        duration_months: 12,
        total_price: 120000
      }
    }),
    prisma.package.create({
      data: {
        name: 'الباقة الفضية - تسويق رقمي',
        type: 'تسويق',
        duration_months: 6,
        total_price: 45000
      }
    }),
    prisma.package.create({
      data: {
        name: 'باقة تطوير التطبيقات',
        type: 'تطوير',
        duration_months: 9,
        total_price: 135000
      }
    })
  ]);

  console.log('✅ Packages created');

  // Create package-service relationships
  await Promise.all([
    // Golden package - all services
    prisma.packageService.createMany({
      data: services.map(service => ({
        package_id: packages[0].package_id,
        service_id: service.service_id
      }))
    }),
    // Silver package - SEO and SMM
    prisma.packageService.createMany({
      data: [
        { package_id: packages[1].package_id, service_id: services[1].service_id },
        { package_id: packages[1].package_id, service_id: services[2].service_id }
      ]
    }),
    // App development package
    prisma.packageService.createMany({
      data: [
        { package_id: packages[2].package_id, service_id: services[0].service_id },
        { package_id: packages[2].package_id, service_id: services[3].service_id }
      ]
    })
  ]);

  console.log('✅ Package-service relationships created');

  // Create company-package relationships
  await Promise.all([
    // Main company gets all packages
    prisma.companyPackage.createMany({
      data: packages.map((pkg: Package) => ({
        company_id: companies[0].company_id,
        package_id: pkg.package_id
      }))
    }),
    // Riyadh company gets golden and silver packages
    prisma.companyPackage.createMany({
      data: [
        { company_id: companies[1].company_id, package_id: packages[0].package_id },
        { company_id: companies[1].company_id, package_id: packages[1].package_id }
      ]
    }),
    // Jeddah company gets app development package
    prisma.companyPackage.createMany({
      data: [
        { company_id: companies[2].company_id, package_id: packages[2].package_id }
      ]
    })
  ]);

  console.log('✅ Company-package relationships created');

  // Create contract clauses
  await Promise.all([
    prisma.contractClause.create({
      data: {
        clause_text: 'يتم تسليم تقارير شهرية مفصلة لأداء SEO مع تحليل الكلمات المفتاحية والترتيب في محركات البحث.',
        duration_months: 6,
        sort_order: 1,
        service_id: services[1].service_id
      }
    }),
    prisma.contractClause.create({
      data: {
        clause_text: 'يتم تضمين تحليل منافسين ربع سنوي (QBR) مع توصيات استراتيجية للتحسين.',
        duration_months: 12,
        sort_order: 1,
        service_id: services[1].service_id
      }
    }),
    prisma.contractClause.create({
      data: {
        clause_text: 'يتم توفير 20 تصميم إبداعي شهريًا مع إمكانية التعديلات المجانية.',
        duration_months: 12,
        sort_order: 2,
        service_id: services[0].service_id
      }
    }),
    prisma.contractClause.create({
      data: {
        clause_text: 'إدارة يومية لجميع منصات التواصل الاجتماعي مع إنشاء محتوى مخصص.',
        duration_months: 6,
        sort_order: 1,
        service_id: services[2].service_id
      }
    }),
    prisma.contractClause.create({
      data: {
        clause_text: 'تطوير موقع ويب متجاوب مع جميع الأجهزة مع ضمان سرعة التحميل.',
        duration_months: 9,
        sort_order: 1,
        service_id: services[3].service_id
      }
    })
  ]);

  console.log('✅ Contract clauses created');

  // Create addons
  await Promise.all([
    prisma.addon.create({
      data: {
        name: 'الدعم الفني المتقدم',
        price: 5000,
        description: 'دعم فني على مدار الساعة'
      }
    }),
    prisma.addon.create({
      data: {
        name: 'خدمات CRO',
        price: 8000,
        description: 'تحسين معدل التحويل'
      }
    })
  ]);

  console.log('✅ Addons created');

  // Create coupons
  await prisma.coupon.create({
    data: {
      code: 'ZIKOLA10',
      discount_value: 10,
      expiry_date: new Date('2025-12-31'),
      usage_limit: 100,
      used_count: 0
    }
  });

  console.log('✅ Coupons created');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
