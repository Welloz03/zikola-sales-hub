import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Package, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Packages = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const packages = [
    {
      id: 1,
      name: "الباقة الذهبية - تسويق متكامل",
      type: "Gold",
      duration: "12 شهر",
      totalPrice: 120000,
      services: ["إدارة وسائل التواصل", "SEO", "UI/UX Design"],
      company: "الشركة الرئيسية",
    },
    {
      id: 2,
      name: "الباقة الفضية - تسويق رقمي",
      type: "Silver",
      duration: "6 أشهر",
      totalPrice: 45000,
      services: ["إدارة وسائل التواصل", "SEO"],
      company: "الشركة الرئيسية",
    },
    {
      id: 3,
      name: "باقة تطوير التطبيقات",
      type: "Gold",
      duration: "9 أشهر",
      totalPrice: 135000,
      services: ["تطوير تطبيقات", "UI/UX Design", "اختبار الجودة"],
      company: "فرع التطوير",
    },
  ];

  const availableServices = [
    { id: 1, name: "إدارة وسائل التواصل الاجتماعي", cost: 5000 },
    { id: 2, name: "تحسين محركات البحث SEO", cost: 8000 },
    { id: 3, name: "تصميم واجهة المستخدم UI/UX", cost: 12000 },
    { id: 4, name: "تطوير تطبيقات الويب", cost: 15000 },
    { id: 5, name: "الإعلانات الإبداعية بالذكاء الاصطناعي", cost: 7000 },
  ];

  const companies = ["الشركة الرئيسية", "فرع التطوير", "فرع التسويق"];

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = availableServices.find(s => s.id === serviceId);
      return total + (service?.cost || 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    toast({
      title: "تمت إضافة الباقة",
      description: "تم إنشاء الباقة الجديدة بنجاح",
    });
    
    setIsDialogOpen(false);
    setSelectedServices([]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">📦 إدارة الباقات</h1>
            <p className="text-muted-foreground mt-1">إنشاء وإدارة باقات الخدمات</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-secondary text-secondary-foreground rounded-xl shadow-glow-purple hover:opacity-90 h-11">
                <Plus className="ml-2 h-5 w-5" />
                باقة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">إنشاء باقة جديدة</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="packageName">اسم الباقة</Label>
                    <Input
                      id="packageName"
                      name="packageName"
                      placeholder="مثال: الباقة الذهبية"
                      className="bg-muted/50 border-border rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packageType">نوع الباقة</Label>
                    <Select name="packageType">
                      <SelectTrigger className="bg-muted/50 border-border rounded-lg">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gold">ذهبية</SelectItem>
                        <SelectItem value="Silver">فضية</SelectItem>
                        <SelectItem value="Bronze">برونزية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">المدة الزمنية</Label>
                    <Select name="duration">
                      <SelectTrigger className="bg-muted/50 border-border rounded-lg">
                        <SelectValue placeholder="اختر المدة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 أشهر</SelectItem>
                        <SelectItem value="6">6 أشهر</SelectItem>
                        <SelectItem value="9">9 أشهر</SelectItem>
                        <SelectItem value="12">12 شهر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">تعيين للشركة</Label>
                    <Select name="company">
                      <SelectTrigger className="bg-muted/50 border-border rounded-lg">
                        <SelectValue placeholder="اختر الشركة" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company} value={company}>{company}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>اختر الخدمات المتضمنة</Label>
                  <Card className="p-4 bg-muted/30 border-border space-y-3">
                    {availableServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`service-${service.id}`}
                            checked={selectedServices.includes(service.id)}
                            onCheckedChange={() => handleServiceToggle(service.id)}
                          />
                          <label
                            htmlFor={`service-${service.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {service.name}
                          </label>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {service.cost.toLocaleString()} ر.س
                        </span>
                      </div>
                    ))}
                  </Card>
                </div>

                <Card className="p-4 bg-gradient-primary/10 border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">الإجمالي التلقائي</span>
                    <span className="text-2xl font-bold text-primary">
                      {calculateTotal().toLocaleString()} ر.س
                    </span>
                  </div>
                </Card>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-secondary text-secondary-foreground rounded-lg hover:opacity-90"
                    disabled={selectedServices.length === 0}
                  >
                    إنشاء الباقة
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setSelectedServices([]);
                    }}
                    className="flex-1 rounded-lg border-border"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className="p-6 bg-gradient-card border-border shadow-card hover:shadow-glow-purple transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        pkg.type === "Gold" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                      }`}>
                        {pkg.type === "Gold" ? "ذهبية" : "فضية"}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                        {pkg.duration}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/10">
                    <Package className="h-6 w-6 text-secondary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-semibold">الخدمات المتضمنة:</p>
                  <div className="space-y-2">
                    {pkg.services.map((service, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-muted-foreground">الشركة المخصصة</span>
                    <span className="font-semibold text-foreground">{pkg.company}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-foreground">السعر الإجمالي</span>
                    <span className="text-2xl font-bold text-primary">
                      {pkg.totalPrice.toLocaleString()} ر.س
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-lg border-border hover:bg-muted/50"
                  >
                    <Edit className="ml-1 h-4 w-4" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-destructive/50 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Packages;
