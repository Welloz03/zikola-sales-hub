import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Users, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Services = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const services = [
    { id: 1, name: "إدارة وسائل التواصل الاجتماعي", department: "SMM", monthlyCost: 5000, subscribers: 23 },
    { id: 2, name: "تحسين محركات البحث SEO", department: "SEO", monthlyCost: 8000, subscribers: 18 },
    { id: 3, name: "تصميم واجهة المستخدم UI/UX", department: "UI/UX", monthlyCost: 12000, subscribers: 15 },
    { id: 4, name: "تطوير تطبيقات الويب", department: "Web Dev", monthlyCost: 15000, subscribers: 12 },
    { id: 5, name: "الإعلانات الإبداعية بالذكاء الاصطناعي", department: "AI Creative", monthlyCost: 7000, subscribers: 20 },
    { id: 6, name: "إدارة المؤثرين", department: "Influencer", monthlyCost: 6000, subscribers: 14 },
  ];

  const departments = ["SMM", "SEO", "UI/UX", "Web Dev", "AI Creative", "Influencer", "Media Buying", "Branding"];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    toast({
      title: editingService ? "تم تحديث الخدمة" : "تمت إضافة الخدمة",
      description: `تم ${editingService ? "تحديث" : "إضافة"} الخدمة بنجاح`,
    });
    
    setIsDialogOpen(false);
    setEditingService(null);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`هل أنت متأكد من حذف خدمة "${name}"؟`)) {
      toast({
        title: "تم حذف الخدمة",
        description: "تم حذف الخدمة بنجاح",
        variant: "destructive",
      });
    }
  };

  const filteredServices = services.filter(service =>
    service.name.includes(searchQuery) || service.department.includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">⚙️ إدارة الخدمات</h1>
            <p className="text-muted-foreground mt-1">إدارة وتنظيم جميع الخدمات المتاحة</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-primary text-primary-foreground rounded-xl shadow-glow-orange hover:opacity-90 h-11"
                onClick={() => setEditingService(null)}
              >
                <Plus className="ml-2 h-5 w-5" />
                خدمة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {editingService ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceName">اسم الخدمة</Label>
                  <Input
                    id="serviceName"
                    name="serviceName"
                    placeholder="مثال: إدارة وسائل التواصل الاجتماعي"
                    defaultValue={editingService?.name}
                    className="bg-muted/50 border-border rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">القسم المسؤول</Label>
                  <Select name="department" defaultValue={editingService?.department}>
                    <SelectTrigger className="bg-muted/50 border-border rounded-lg">
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">الوصف التفصيلي</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="اكتب وصفاً تفصيلياً للخدمة..."
                    defaultValue={editingService?.description}
                    className="bg-muted/50 border-border rounded-lg min-h-24"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyCost">التكلفة الشهرية (ر.س)</Label>
                  <Input
                    id="monthlyCost"
                    name="monthlyCost"
                    type="number"
                    placeholder="5000"
                    defaultValue={editingService?.monthlyCost}
                    className="bg-muted/50 border-border rounded-lg"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-primary text-primary-foreground rounded-lg hover:opacity-90"
                  >
                    {editingService ? "تحديث" : "إضافة"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingService(null);
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

        {/* Search */}
        <Card className="p-4 bg-gradient-card border-border shadow-card">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="بحث عن خدمة أو قسم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-muted/50 border-border rounded-lg h-11"
            />
          </div>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="p-6 bg-gradient-card border-border shadow-card hover:shadow-glow-orange transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">{service.name}</h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
                      {service.department}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">التكلفة الشهرية</span>
                    <span className="font-bold text-primary text-lg">{service.monthlyCost.toLocaleString()} ر.س</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">العملاء المشتركون</span>
                    <div className="flex items-center gap-1 text-foreground font-semibold">
                      <Users className="h-4 w-4" />
                      <span>{service.subscribers}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-lg border-border hover:bg-muted/50"
                    onClick={() => {
                      setEditingService(service);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="ml-1 h-4 w-4" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-destructive/50 text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(service.id, service.name)}
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

export default Services;
