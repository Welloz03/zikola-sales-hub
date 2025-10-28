import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Settings,
  Search,
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Shield,
  LogOut,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  role?: "admin" | "agent";
}

const DashboardLayout = ({ children, role = "admin" }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  const adminNav = [
    { label: "لوحة التحكم", path: "/dashboard", icon: LayoutDashboard },
    { label: "الخدمات", path: "/services", icon: Package },
    { label: "الباقات", path: "/packages", icon: Package },
    { label: "العقود", path: "/contracts", icon: FileText },
    { label: "المستخدمين", path: "/users", icon: Users },
  ];

  const agentNav = [
    { label: "لوحة التحكم", path: "/agent/dashboard", icon: LayoutDashboard },
    { label: "الباقات المتاحة", path: "/agent/packages", icon: Package },
    { label: "عقودي", path: "/agent/contracts", icon: FileText },
  ];

  const navigation = role === "admin" ? adminNav : agentNav;
  const userName = role === "admin" ? "أحمد محمد" : "خالد أحمد";
  const userRole = role === "admin" ? "مدير المبيعات" : "وكيل مبيعات";

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1
                onClick={() => navigate("/")}
                className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent cursor-pointer"
              >
                Zikola
              </h1>
              <nav className="hidden md:flex gap-6">
                {navigation.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <item.icon className="h-4 w-4 group-hover:text-primary transition-colors" />
                    <span>{item.label}</span>
                  </button>
                ))}
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
                  <p className="text-sm font-semibold">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userRole}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {userName.charAt(0)}
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate("/login")}
                className="rounded-lg text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
