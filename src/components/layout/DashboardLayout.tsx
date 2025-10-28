import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";
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
  AlertCircle,
  CheckCircle2,
  User,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  role?: "admin" | "agent";
}

const DashboardLayout = ({ children, role = "admin" }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: "contract",
      important: true,
      unread: true,
      message: "تم إرسال عقد جديد من وكيل المبيعات خالد للمراجعة",
      time: "منذ 5 دقائق",
      icon: FileText
    },
    {
      id: 2,
      type: "addon",
      important: true,
      unread: true,
      message: "طلب إضافة قسيمة خصم من وكيل المبيعات سارة",
      time: "منذ 30 دقيقة",
      icon: AlertCircle
    },
    {
      id: 3,
      type: "revenue",
      important: false,
      unread: false,
      message: "تم تجاوز هدف الإيرادات الشهرية بنسبة 15%",
      time: "منذ 3 ساعات",
      icon: CheckCircle2
    },
    {
      id: 4,
      type: "contract",
      important: false,
      unread: false,
      message: "تمت الموافقة على العقد #CON-2025-002",
      time: "منذ 1 يوم",
      icon: CheckCircle2
    }
  ];

  const adminNav = [
    { label: "لوحة التحكم", path: "/dashboard", icon: LayoutDashboard },
    { label: "الخدمات", path: "/services", icon: Package },
    { label: "الباقات", path: "/packages", icon: Package },
    { label: "بنود التعاقد", path: "/contract-clauses", icon: FileText },
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
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="icon" variant="ghost" className="rounded-lg relative">
                      <Bell className="h-5 w-5" />
                      {hasUnreadNotifications && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[350px]">
                    <SheetHeader>
                      <SheetTitle className="text-right">الإشعارات</SheetTitle>
                    </SheetHeader>
                    <Tabs defaultValue="all" className="mt-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">الكل</TabsTrigger>
                        <TabsTrigger value="important">مهم</TabsTrigger>
                        <TabsTrigger value="contracts">العقود</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all" className="mt-4">
                        <ScrollArea className="h-[70vh]">
                          {mockNotifications.map((notification) => (
                            <Card key={notification.id} className={`mb-3 p-3 ${notification.unread ? 'border-primary/50' : ''}`}>
                              <div className="flex gap-3">
                                <div className={`mt-1 rounded-full p-1.5 ${notification.important ? 'bg-primary/10' : 'bg-secondary/20'}`}>
                                  <notification.icon className={`h-4 w-4 ${notification.important ? 'text-primary' : 'text-secondary'}`} />
                                </div>
                                <div className="flex-1 text-right">
                                  <p className="text-sm">{notification.message}</p>
                                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </ScrollArea>
                      </TabsContent>
                      <TabsContent value="important" className="mt-4">
                        <ScrollArea className="h-[70vh]">
                          {mockNotifications.filter(n => n.important).map((notification) => (
                            <Card key={notification.id} className={`mb-3 p-3 ${notification.unread ? 'border-primary/50' : ''}`}>
                              <div className="flex gap-3">
                                <div className="mt-1 rounded-full bg-primary/10 p-1.5">
                                  <notification.icon className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1 text-right">
                                  <p className="text-sm">{notification.message}</p>
                                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </ScrollArea>
                      </TabsContent>
                      <TabsContent value="contracts" className="mt-4">
                        <ScrollArea className="h-[70vh]">
                          {mockNotifications.filter(n => n.type === "contract").map((notification) => (
                            <Card key={notification.id} className={`mb-3 p-3 ${notification.unread ? 'border-primary/50' : ''}`}>
                              <div className="flex gap-3">
                                <div className={`mt-1 rounded-full p-1.5 ${notification.important ? 'bg-primary/10' : 'bg-secondary/20'}`}>
                                  <notification.icon className={`h-4 w-4 ${notification.important ? 'text-primary' : 'text-secondary'}`} />
                                </div>
                                <div className="flex-1 text-right">
                                  <p className="text-sm">{notification.message}</p>
                                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </SheetContent>
                </Sheet>
                
                {/* INTEGRATED THEME TOGGLE */}
                <ThemeToggle />
                
                <Button size="icon" variant="ghost" className="rounded-lg" onClick={() => navigate('/settings')}>
                  <Settings className="h-5 w-5" />
                </Button>
                
                {/* Profile Dropdown Menu */}
                <DropdownMenu dir="rtl">
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 pr-4 border-r border-border cursor-pointer hover:opacity-80 transition-opacity">
                      <div className="text-right">
                        <p className="text-sm font-semibold">{userName}</p>
                        <p className="text-xs text-muted-foreground">{userRole}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                        {userName.charAt(0)}
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-card border-border shadow-card">
                    <DropdownMenuLabel className="text-right font-bold text-foreground">
                      {userName} ({userRole})
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer flex justify-end items-center">
                      <span>تعديل الملف الشخصي</span>
                      <User className="mr-2 h-4 w-4 text-primary" />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem onClick={() => navigate("/login")} className="cursor-pointer text-destructive focus:text-destructive flex justify-end items-center">
                      <span>تسجيل الخروج</span>
                      <LogOut className="mr-2 h-4 w-4" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
