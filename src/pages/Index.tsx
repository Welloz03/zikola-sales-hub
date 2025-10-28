import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Target, TrendingUp, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="inline-block">
              <h1 className="text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                Zikola
              </h1>
              <p className="text-sm text-muted-foreground tracking-wider">SALES & MANAGEMENT SYSTEM</p>
            </div>

            {/* Main Heading */}
            <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                نظام متكامل لإدارة
                <span className="bg-gradient-secondary bg-clip-text text-transparent"> المبيعات والتسويق</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                منصة احترافية لإدارة الخدمات، الباقات، العقود والعملاء بكفاءة عالية
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                onClick={() => navigate("/login")}
                className="h-14 px-8 bg-gradient-primary text-primary-foreground rounded-xl shadow-glow-orange hover:opacity-90 transition-all text-lg font-semibold group"
              >
                <span>ابدأ الآن</span>
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                className="h-14 px-8 border-2 border-border hover:bg-muted/50 rounded-xl text-lg font-semibold"
              >
                تعرف على المزيد
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            لماذا Zikola؟
          </h3>
          <p className="text-muted-foreground text-lg">
            كل ما تحتاجه لإدارة عملك في مكان واحد
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              title: "سرعة وكفاءة",
              description: "إدارة سريعة وفعالة لجميع عملياتك اليومية",
              color: "primary"
            },
            {
              icon: Target,
              title: "دقة في التتبع",
              description: "تتبع دقيق لجميع العقود والخدمات والإيرادات",
              color: "secondary"
            },
            {
              icon: TrendingUp,
              title: "تحليلات متقدمة",
              description: "تقارير شاملة لمتابعة الأداء واتخاذ القرارات",
              color: "primary"
            },
            {
              icon: Shield,
              title: "أمان وموثوقية",
              description: "حماية عالية لبياناتك مع نظام صلاحيات متقدم",
              color: "secondary"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className={`p-6 rounded-2xl bg-gradient-card border border-border shadow-card hover:shadow-${feature.color === 'primary' ? 'glow-orange' : 'glow-purple'} transition-all cursor-pointer group`}
            >
              <div className={`w-14 h-14 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`h-7 w-7 text-${feature.color}`} />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-card border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "عميل نشط" },
              { value: "1000+", label: "عقد مكتمل" },
              { value: "50+", label: "خدمة متاحة" },
              { value: "99.9%", label: "وقت التشغيل" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-card border border-border rounded-3xl p-12 text-center shadow-card">
          <h3 className="text-4xl font-bold text-foreground mb-4">
            جاهز للبدء؟
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            انضم إلى مئات الشركات التي تثق في Zikola لإدارة عملياتها
          </p>
          <Button 
            onClick={() => navigate("/login")}
            className="h-14 px-12 bg-gradient-secondary text-secondary-foreground rounded-xl shadow-glow-purple hover:opacity-90 transition-all text-lg font-semibold"
          >
            سجل دخولك الآن
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">© 2025 Zikola. جميع الحقوق محفوظة.</p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                الشروط والأحكام
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                اتصل بنا
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
