import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  Package, 
  Users,
  Plus,
  Clock,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { apiService } from "@/lib/api";

const AgentDashboard = () => {
  const navigate = useNavigate();

  // Mock user ID - in real app, this would come from auth context
  const userId = "agent-123";

  // Fetch agent metrics using React Query
  const { data: agentData, isLoading: agentLoading, error: agentError } = useQuery({
    queryKey: ['agent-metrics', userId],
    queryFn: () => apiService.getAgentMetrics(userId),
  });

  // Default agent stats
  const defaultAgentStats = {
    monthlySales: 12,
    targetSales: 20,
    totalRevenue: 145000,
    remainingFund: 85000,
    activeCustomers: 8,
  };

  const agentStats = agentData?.stats || defaultAgentStats;
  const recentContracts = agentData?.recentContracts || [
    { 
      id: 1, 
      client: "شركة التقنية المتقدمة", 
      package: "الباقة الذهبية", 
      amount: 15000, 
      status: "مكتمل",
      date: "2025-01-15"
    },
    { 
      id: 2, 
      client: "مؤسسة الابتكار", 
      package: "باقة تطوير التطبيقات", 
      amount: 28000, 
      status: "قيد المراجعة",
      date: "2025-01-18"
    },
    { 
      id: 3, 
      client: "شركة النجاح التجاري", 
      package: "الباقة الفضية", 
      amount: 8500, 
      status: "مكتمل",
      date: "2025-01-20"
    },
  ];

  const assignedPackages = agentData?.assignedPackages || [
    { id: 1, name: "الباقة الذهبية - تسويق متكامل", price: 120000, services: 5 },
    { id: 2, name: "الباقة الفضية - تسويق رقمي", price: 45000, services: 3 },
    { id: 3, name: "باقة تطوير التطبيقات", price: 135000, services: 4 },
  ];

  const progressPercentage = (agentStats.monthlySales / agentStats.targetSales) * 100;

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">مرحباً، خالد 👋</h2>
            <p className="text-muted-foreground mt-1">إليك نظرة على أدائك هذا الشهر</p>
          </div>
          <Button 
            onClick={() => navigate("/agent/create-contract")}
            className="bg-gradient-primary text-primary-foreground rounded-xl shadow-glow-orange hover:opacity-90 h-12 px-6"
          >
            <Plus className="ml-2 h-5 w-5" />
            عقد جديد
          </Button>
        </div>

        {/* Performance Card */}
        <Card className="p-6 bg-gradient-card border-border shadow-card">
          {agentLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">جاري تحميل البيانات...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">المبيعات الشهرية</p>
                  <p className="text-3xl font-bold text-foreground">
                    {agentStats.monthlySales} <span className="text-lg text-muted-foreground">/ {agentStats.targetSales}</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">تقدم الهدف</span>
                  <span className="font-semibold text-foreground">{progressPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">إجمالي الإيرادات</p>
                  <p className="text-lg font-bold text-primary">{agentStats.totalRevenue.toLocaleString()} ر.س</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">الحد المتبقي</p>
                  <p className="text-lg font-bold text-secondary">{agentStats.remainingFund.toLocaleString()} ر.س</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center p-6 rounded-xl bg-gradient-secondary/10 border border-secondary/20">
              <div className="relative w-32 h-32 mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${progressPercentage * 3.51} 351`}
                    className="text-secondary"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-secondary">{progressPercentage.toFixed(0)}%</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground">من الهدف الشهري</p>
            </div>
          </div>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Contracts */}
          <Card className="lg:col-span-2 p-6 bg-gradient-card border-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">العقود الأخيرة</h3>
              <Button variant="ghost" size="sm" className="text-secondary">
                عرض الكل
              </Button>
            </div>
            <div className="space-y-3">
              {recentContracts.map((contract) => (
                <div 
                  key={contract.id} 
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{contract.client}</p>
                      <p className="text-sm text-muted-foreground">{contract.package}</p>
                      <p className="text-xs text-muted-foreground">{contract.date}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-foreground mb-1">{contract.amount.toLocaleString()} ر.س</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      contract.status === "مكتمل" ? "bg-green-500/10 text-green-500" :
                      "bg-primary/10 text-primary"
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="p-6 bg-gradient-card border-border shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">العملاء النشطين</p>
                  <p className="text-2xl font-bold text-foreground">{agentStats.activeCustomers}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full rounded-lg border-border">
                عرض القائمة
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-card border-border shadow-card">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-secondary" />
                الباقات المخصصة
              </h4>
              <div className="space-y-2">
                {assignedPackages.map((pkg) => (
                  <div key={pkg.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <p className="text-sm font-semibold text-foreground mb-1">{pkg.name}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{pkg.services} خدمات</span>
                      <span className="font-bold text-primary">{pkg.price.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentDashboard;
