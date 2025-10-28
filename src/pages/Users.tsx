import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Plus, Users as UsersIcon, Edit, Trash2, UserPlus, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock data for users
const mockUsers = [
  {
    id: "USR-001",
    name: "أحمد محمد",
    email: "ahmed@zikola.com",
    role: "admin",
    company: "زيكولا الرئيسي",
    performance: {
      totalRevenue: 0,
      contractsCount: 0,
      remainingFund: 0
    }
  },
  {
    id: "USR-002",
    name: "خالد أحمد",
    email: "khaled@zikola.com",
    role: "agent",
    company: "زيكولا الرئيسي",
    performance: {
      totalRevenue: 245000,
      contractsCount: 12,
      remainingFund: 85000
    }
  },
  {
    id: "USR-003",
    name: "سارة محمد",
    email: "sara@zikola.com",
    role: "agent",
    company: "زيكولا الرياض",
    performance: {
      totalRevenue: 180000,
      contractsCount: 8,
      remainingFund: 120000
    }
  },
  {
    id: "USR-004",
    name: "محمد علي",
    email: "mohamed@zikola.com",
    role: "agent",
    company: "زيكولا جدة",
    performance: {
      totalRevenue: 135000,
      contractsCount: 6,
      remainingFund: 65000
    }
  },
  {
    id: "USR-005",
    name: "فاطمة أحمد",
    email: "fatima@zikola.com",
    role: "admin",
    company: "زيكولا جدة",
    performance: {
      totalRevenue: 0,
      contractsCount: 0,
      remainingFund: 0
    }
  }
];

// Mock data for companies
const companies = ["زيكولا الرئيسي", "زيكولا الرياض", "زيكولا جدة"];

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPerformanceDialogOpen, setIsPerformanceDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  
  // Form state for new/edit user
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "agent",
    company: "زيكولا الرئيسي"
  });

  // Filter users based on search query and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.includes(searchQuery) || 
                         user.email.includes(searchQuery);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesCompany = companyFilter === "all" || user.company === companyFilter;
    
    return matchesSearch && matchesRole && matchesCompany;
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "agent",
      company: "زيكولا الرئيسي"
    });
    setEditMode(false);
  };

  // Open dialog for adding new user
  const openAddUserDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Open dialog for editing user
  const openEditUserDialog = (user: any) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company
    });
    setSelectedUser(user);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  // Open performance dialog for agent
  const openPerformanceDialog = (user: any) => {
    setSelectedUser(user);
    setIsPerformanceDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editMode && selectedUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, ...formData } : user
      );
      setUsers(updatedUsers);
      toast({
        title: "تم تحديث المستخدم",
        description: `تم تحديث بيانات ${formData.name} بنجاح`,
      });
    } else {
      // Add new user
      const newUser = {
        id: `USR-${String(users.length + 1).padStart(3, '0')}`,
        ...formData,
        performance: {
          totalRevenue: 0,
          contractsCount: 0,
          remainingFund: 0
        }
      };
      setUsers([...users, newUser]);
      toast({
        title: "تم إضافة المستخدم",
        description: `تم إضافة ${formData.name} بنجاح`,
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    toast({
      title: "تم حذف المستخدم",
      description: "تم حذف المستخدم بنجاح",
      variant: "destructive",
    });
  };

  // Mock performance data for charts
  const performanceData = {
    monthly: [
      { month: "يناير", revenue: 18000 },
      { month: "فبراير", revenue: 22000 },
      { month: "مارس", revenue: 15000 },
      { month: "أبريل", revenue: 30000 },
      { month: "مايو", revenue: 25000 },
      { month: "يونيو", revenue: 35000 }
    ],
    contracts: [
      { status: "مكتمل", count: 8 },
      { status: "قيد المراجعة", count: 3 },
      { status: "مرفوض", count: 1 }
    ]
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">👥 إدارة المستخدمين</h1>
            <p className="text-muted-foreground mt-1">إدارة وتتبع أداء فريق المبيعات</p>
          </div>
          
          <Button 
            onClick={openAddUserDialog}
            className="bg-gradient-primary text-primary-foreground rounded-xl shadow-glow-orange hover:opacity-90 h-11"
          >
            <UserPlus className="ml-2 h-5 w-5" />
            إضافة مستخدم
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative w-64">
            <Input
              placeholder="بحث عن مستخدم..."
              className="bg-muted/50 border-border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value)}>
            <SelectTrigger className="w-40 bg-muted/50 border-border rounded-lg">
              <SelectValue placeholder="الدور" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأدوار</SelectItem>
              <SelectItem value="admin">مدير</SelectItem>
              <SelectItem value="agent">وكيل مبيعات</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={companyFilter} onValueChange={(value) => setCompanyFilter(value)}>
            <SelectTrigger className="w-40 bg-muted/50 border-border rounded-lg">
              <SelectValue placeholder="الشركة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الشركات</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>{company}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">المعرف</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">الاسم</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">البريد الإلكتروني</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">الدور</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">الشركة</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">الإيرادات الكلية</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">عدد العقود</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">الحد المتبقي</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{user.id}</td>
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      {user.role === "admin" ? "مدير" : "وكيل مبيعات"}
                    </td>
                    <td className="py-3 px-4">{user.company}</td>
                    <td className="py-3 px-4 font-medium">
                      {user.role === "agent" ? `${user.performance.totalRevenue.toLocaleString()} ر.س` : "-"}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {user.role === "agent" ? user.performance.contractsCount : "-"}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {user.role === "agent" ? `${user.performance.remainingFund.toLocaleString()} ر.س` : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {user.role === "agent" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg border-primary/50 text-primary hover:bg-primary/10"
                            onClick={() => openPerformanceDialog(user)}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-lg border-border hover:bg-muted/50"
                          onClick={() => openEditUserDialog(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-lg border-destructive/50 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add/Edit User Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-card border-border max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {editMode ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-muted/50 border-border"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-muted/50 border-border"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">الدور</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger id="role" className="bg-muted/50 border-border">
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">مدير</SelectItem>
                    <SelectItem value="agent">وكيل مبيعات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">الشركة</Label>
                <Select 
                  value={formData.company} 
                  onValueChange={(value) => handleSelectChange("company", value)}
                >
                  <SelectTrigger id="company" className="bg-muted/50 border-border">
                    <SelectValue placeholder="اختر الشركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>{company}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="rounded-lg border-border hover:bg-muted/50"
                  onClick={() => setIsDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-primary text-primary-foreground rounded-lg shadow-glow-orange hover:opacity-90"
                >
                  {editMode ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Agent Performance Dialog */}
        {selectedUser && (
          <Dialog open={isPerformanceDialogOpen} onOpenChange={setIsPerformanceDialogOpen}>
            <DialogContent className="bg-card border-border max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  أداء {selectedUser.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Performance Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 border-border bg-gradient-card">
                    <div className="flex flex-col items-center">
                      <div className="text-muted-foreground mb-2">الإيرادات الكلية</div>
                      <div className="text-2xl font-bold text-primary">
                        {selectedUser.performance.totalRevenue.toLocaleString()} ر.س
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border-border bg-gradient-card">
                    <div className="flex flex-col items-center">
                      <div className="text-muted-foreground mb-2">عدد العقود</div>
                      <div className="text-2xl font-bold text-secondary">
                        {selectedUser.performance.contractsCount}
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border-border bg-gradient-card">
                    <div className="flex flex-col items-center">
                      <div className="text-muted-foreground mb-2">الحد المتبقي</div>
                      <div className="text-2xl font-bold text-primary">
                        {selectedUser.performance.remainingFund.toLocaleString()} ر.س
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Performance Tabs */}
                <Tabs defaultValue="revenue" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="revenue">الإيرادات الشهرية</TabsTrigger>
                    <TabsTrigger value="contracts">حالة العقود</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="revenue">
                    <Card className="border-border p-4">
                      <h3 className="font-semibold mb-4">الإيرادات الشهرية</h3>
                      <div className="h-64">
                        <div className="flex items-end justify-between h-48 gap-2">
                          {performanceData.monthly.map((month, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end">
                              <div 
                                className="w-full bg-gradient-primary rounded-t-lg transition-all hover:opacity-80"
                                style={{ height: `${(month.revenue / 35000) * 100}%` }}
                              />
                              <div className="mt-2 text-xs text-muted-foreground">{month.month}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="contracts">
                    <Card className="border-border p-4">
                      <h3 className="font-semibold mb-4">حالة العقود</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {performanceData.contracts.map((item, i) => (
                          <Card key={i} className={`p-4 border-border ${
                            item.status === "مكتمل" ? "bg-green-500/10" : 
                            item.status === "قيد المراجعة" ? "bg-primary/10" : 
                            "bg-destructive/10"
                          }`}>
                            <div className="flex flex-col items-center">
                              <div className={`text-lg font-bold ${
                                item.status === "مكتمل" ? "text-green-500" : 
                                item.status === "قيد المراجعة" ? "text-primary" : 
                                "text-destructive"
                              }`}>
                                {item.count}
                              </div>
                              <div className="text-sm text-muted-foreground">{item.status}</div>
                            </div>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">آخر العقود</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                            <div>
                              <div className="font-medium">شركة التقنية المتقدمة</div>
                              <div className="text-sm text-muted-foreground">باقة ذهبية - تسويق رقمي</div>
                            </div>
                            <div className="text-left">
                              <div className="font-bold">15,000 ر.س</div>
                              <div className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 inline-block">مكتمل</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                            <div>
                              <div className="font-medium">مؤسسة الابتكار</div>
                              <div className="text-sm text-muted-foreground">تطوير تطبيق أصلي</div>
                            </div>
                            <div className="text-left">
                              <div className="font-bold">28,000 ر.س</div>
                              <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary inline-block">قيد المراجعة</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Users;