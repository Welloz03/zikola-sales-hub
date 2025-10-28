import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  Package, 
  DollarSign,
  ShoppingBag,
  Plus,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { apiService } from "@/lib/api";

const Dashboard = () => {
  const navigate = useNavigate();

  // Fetch admin metrics using React Query
  const { data: metricsData, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: apiService.getAdminMetrics,
  });

  // Default metrics structure
  const defaultMetrics = [
    { label: "إجمالي الإيرادات", value: "245,000 ر.س", change: "+12.5%", icon: DollarSign, color: "primary" },
    { label: "عدد العقود النشطة", value: "48", change: "+8", icon: ShoppingBag, color: "secondary" },
    { label: "عدد العملاء", value: "156", change: "+23", icon: Users, color: "primary" },
    { label: "الخدمات المقدمة", value: "12", change: "جديد", icon: Package, color: "secondary" },
  ];

  const metrics = metricsData || defaultMetrics;
  const recentActivity = metricsData?.recentActivity || [
    { client: "شركة التقنية المتقدمة", service: "باقة ذهبية - تسويق رقمي", amount: "15,000 ر.س", status: "مكتمل" },
    { client: "مؤسسة الابتكار", service: "تطوير تطبيق أصلي", amount: "28,000 ر.س", status: "قيد التنفيذ" },
    { client: "شركة النجاح التجاري", service: "باقة فضية - SEO", amount: "8,500 ر.س", status: "جديد" },
  ];
  const pendingApprovals = metricsData?.pendingApprovals || 3;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">مرحباً، أحمد 👋</h2>
            <p className="text-muted-foreground">إليك نظرة سريعة على أداء المبيعات اليوم</p>
          </div>
          {pendingApprovals > 0 && (
            <Card className="px-4 py-3 bg-primary/10 border-primary/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">
                  {pendingApprovals} طلبات تحتاج موافقة
                </span>
              </div>
            </Card>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsLoading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i} className="p-6 bg-gradient-card border-border shadow-card">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-muted-foreground">جاري التحميل...</span>
                </div>
              </Card>
            ))
          ) : (
            metrics.map((metric, index) => (
            <Card 
              key={index} 
              className={`p-6 bg-gradient-card border-border shadow-card hover:shadow-${metric.color === 'primary' ? 'glow-orange' : 'glow-purple'} transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${metric.color}/10`}>
                  <metric.icon className={`h-6 w-6 text-${metric.color}`} />
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-${metric.color}/10 text-${metric.color}`}>
                  {metric.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 p-6 bg-gradient-card border-border shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">النشاط الأخير</h3>
              <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary/80">
                عرض الكل
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center">
                      <Package className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{activity.client}</p>
                      <p className="text-sm text-muted-foreground">{activity.service}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-foreground mb-1">{activity.amount}</p>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      activity.status === "مكتمل" ? "bg-green-500/10 text-green-500" :
                      activity.status === "قيد التنفيذ" ? "bg-primary/10 text-primary" :
                      "bg-secondary/10 text-secondary"
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-gradient-card border-border shadow-card">
            <h3 className="text-xl font-bold text-foreground mb-6">إجراءات سريعة</h3>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/services")}
                className="w-full justify-start h-12 bg-gradient-primary text-primary-foreground rounded-xl shadow-glow-orange hover:opacity-90 transition-all"
              >
                <Plus className="ml-2 h-5 w-5" />
                إضافة خدمة
              </Button>
              <Button 
                onClick={() => navigate("/packages")}
                variant="outline" 
                className="w-full justify-start h-12 border-border hover:bg-muted/50 rounded-xl"
              >
                <ShoppingBag className="ml-2 h-5 w-5 text-secondary" />
                إنشاء باقة
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 border-border hover:bg-muted/50 rounded-xl">
                <Package className="ml-2 h-5 w-5 text-secondary" />
                إدارة الكوبونات
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 border-border hover:bg-muted/50 rounded-xl">
                <BarChart3 className="ml-2 h-5 w-5 text-secondary" />
                عرض التقارير
              </Button>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="mt-8 p-4 rounded-xl bg-muted/30">
              <p className="text-sm font-semibold text-foreground mb-3">أداء هذا الشهر</p>
              <div className="flex items-end justify-between h-32 gap-2">
                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end">
                    <div 
                      className="w-full bg-gradient-primary rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>السبت</span>
                <span>الأحد</span>
                <span>الاثنين</span>
                <span>الثلاثاء</span>
                <span>الأربعاء</span>
                <span>الخميس</span>
                <span>الجمعة</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
