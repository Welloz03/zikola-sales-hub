import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, tokenManager } from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiService.login(email, password);
      
      // Store the JWT token
      tokenManager.setToken(response.token, remember);
      
      // Determine user role and navigate accordingly
      const userRole = response.user?.role || 'agent';
      const dashboardPath = userRole === 'admin' ? '/dashboard' : '/agent/dashboard';
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${response.user?.name || 'بك'}`,
      });
      
      navigate(dashboardPath);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "فشل تسجيل الدخول",
        description: error.response?.data?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Zikola
          </h1>
          <p className="text-muted-foreground text-lg">
            نظام إدارة المبيعات والتسويق
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 shadow-card bg-gradient-card border-border">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">تسجيل الدخول</h2>
              <p className="text-muted-foreground">مرحباً بك في نظام Zikola</p>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@zikola.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 bg-muted/50 border-border rounded-xl h-12"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-4 bg-muted/50 border-border rounded-xl h-12"
                  required
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <a href="#" className="text-secondary hover:text-secondary/80 transition-colors">
                نسيت كلمة المرور؟
              </a>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="rounded" 
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember" className="text-muted-foreground">تذكرني</label>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-primary text-primary-foreground rounded-xl shadow-glow-orange hover:opacity-90 transition-all text-lg font-semibold group disabled:opacity-50"
            >
              <span>{isLoading ? "جاري تسجيل الدخول..." : "دخول"}</span>
              <ArrowRight className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-4 text-muted-foreground">أو الدخول باستخدام</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl border-border hover:bg-muted/50 hover:border-secondary transition-all"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="mr-2">Google</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl border-border hover:bg-muted/50 hover:border-secondary transition-all"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="mr-2">Facebook</span>
              </Button>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          ليس لديك حساب؟{" "}
          <a href="#" className="text-secondary hover:text-secondary/80 font-semibold">
            تواصل مع الإدارة
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
