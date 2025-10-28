import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign,
  ShoppingBag,
  Bell,
  Settings,
  Search,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const metrics = [
    { label: "إجمالي الإيرادات", value: "245,000 ر.س", change: "+12.5%", icon: DollarSign, color: "primary" },
    { label: "عدد العقود النشطة", value: "48", change: "+8", icon: ShoppingBag, color: "secondary" },
    { label: "عدد العملاء", value: "156", change: "+23", icon: Users, color: "primary" },
    { label: "الخدمات المقدمة", value: "12", change: "جديد", icon: Package, color: "secondary" },
  ];

  const recentActivity = [
    { client: "شركة التقنية المتقدمة", service: "باقة ذهبية - تسويق رقمي", amount: "15,000 ر.س", status: "مكتمل" },
    { client: "مؤسسة الابتكار", service: "تطوير تطبيق أصلي", amount: "28,000 ر.س", status: "قيد التنفيذ" },
    { client: "شركة النجاح التجاري", service: "باقة فضية - SEO", amount: "8,500 ر.س", status: "جديد" },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Zikola
              </h1>
              <nav className="hidden md:flex gap-6">
                <a href="#" className="text-foreground font-semibold border-b-2 border-primary pb-1">
                  لوحة التحكم
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  الخدمات
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  الباقات
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  العقود
                </a>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="بحث..." 
                  className="pr-10 w-64 bg-muted/50 border-border rounded-lg"
                />
              </div>
              <Button size="icon" variant="ghost" className="rounded-lg relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
              <Button size="icon" variant="ghost" className="rounded-lg">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3 pr-4 border-r border-border">
                <div className="text-right">
                  <p className="text-sm font-semibold">أحمد محمد</p>
                  <p className="text-xs text-muted-foreground">مدير المبيعات</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  أ
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">مرحباً، أحمد 👋</h2>
          <p className="text-muted-foreground">إليك نظرة سريعة على أداء المبيعات اليوم</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
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
          ))}
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
              <Button className="w-full justify-start h-12 bg-gradient-primary text-primary-foreground rounded-xl shadow-glow-orange hover:opacity-90 transition-all">
                <Plus className="ml-2 h-5 w-5" />
                عقد جديد
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 border-border hover:bg-muted/50 rounded-xl">
                <Package className="ml-2 h-5 w-5 text-secondary" />
                إضافة خدمة
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 border-border hover:bg-muted/50 rounded-xl">
                <ShoppingBag className="ml-2 h-5 w-5 text-secondary" />
                إنشاء باقة
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
      </main>
    </div>
  );
};

export default Dashboard;
