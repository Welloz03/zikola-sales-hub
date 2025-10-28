import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock services data
const mockServices = [
  { id: 1, name: "تطوير تطبيق أصلي" },
  { id: 2, name: "خدمات SEO" },
  { id: 3, name: "إدارة وسائل التواصل الاجتماعي" },
  { id: 4, name: "تطوير ويب" },
  { id: 5, name: "تسويق رقمي شامل" }
];

// Mock contract durations
const contractDurations = [
  { months: 3, label: "3 أشهر" },
  { months: 6, label: "6 أشهر" },
  { months: 9, label: "9 أشهر" },
  { months: 12, label: "12 شهر" }
];

// Mock contract clauses data
const mockContractClauses = [
  { 
    id: 1, 
    serviceId: 2, 
    durationMonths: 6, 
    clauseText: "يتم تسليم تقارير شهرية مفصلة لأداء SEO مع تحليل الكلمات المفتاحية والترتيب في محركات البحث.", 
    order: 1 
  },
  { 
    id: 2, 
    serviceId: 2, 
    durationMonths: 12, 
    clauseText: "يتم تضمين تحليل منافسين ربع سنوي (QBR) مع توصيات استراتيجية للتحسين.", 
    order: 1 
  },
  { 
    id: 3, 
    serviceId: 1, 
    durationMonths: 12, 
    clauseText: "يتم توفير 20 تصميم إبداعي شهريًا مع إمكانية التعديلات المجانية.", 
    order: 2 
  },
  { 
    id: 4, 
    serviceId: 3, 
    durationMonths: 6, 
    clauseText: "إدارة يومية لجميع منصات التواصل الاجتماعي مع إنشاء محتوى مخصص.", 
    order: 1 
  },
  { 
    id: 5, 
    serviceId: 4, 
    durationMonths: 9, 
    clauseText: "تطوير موقع ويب متجاوب مع جميع الأجهزة مع ضمان سرعة التحميل.", 
    order: 1 
  }
];

const ContractClauses = () => {
  const { toast } = useToast();
  const [clauses, setClauses] = useState(mockContractClauses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClause, setEditingClause] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    serviceId: "",
    durationMonths: "",
    clauseText: "",
    order: ""
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      serviceId: "",
      durationMonths: "",
      clauseText: "",
      order: ""
    });
    setEditingClause(null);
  };

  // Open dialog for adding new clause
  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Open dialog for editing clause
  const openEditDialog = (clause: any) => {
    setFormData({
      serviceId: clause.serviceId.toString(),
      durationMonths: clause.durationMonths.toString(),
      clauseText: clause.clauseText,
      order: clause.order.toString()
    });
    setEditingClause(clause);
    setIsDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClause = {
      id: editingClause ? editingClause.id : Date.now(),
      serviceId: parseInt(formData.serviceId),
      durationMonths: parseInt(formData.durationMonths),
      clauseText: formData.clauseText,
      order: parseInt(formData.order)
    };

    if (editingClause) {
      // Update existing clause
      setClauses(clauses.map(clause => 
        clause.id === editingClause.id ? newClause : clause
      ));
      toast({
        title: "تم تحديث البند بنجاح",
        description: "تم حفظ التغييرات بنجاح",
      });
    } else {
      // Add new clause
      setClauses([...clauses, newClause]);
      toast({
        title: "تم إضافة البند بنجاح",
        description: "تم إضافة البند الجديد بنجاح",
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  // Handle clause deletion
  const handleDelete = (clauseId: number) => {
    setClauses(clauses.filter(clause => clause.id !== clauseId));
    toast({
      title: "تم حذف البند",
      description: "تم حذف البند بنجاح",
      variant: "destructive",
    });
  };

  // Get service name by ID
  const getServiceName = (serviceId: number) => {
    return mockServices.find(service => service.id === serviceId)?.name || "خدمة غير معروفة";
  };

  // Get duration label by months
  const getDurationLabel = (months: number) => {
    return contractDurations.find(duration => duration.months === months)?.label || `${months} شهر`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">📋 إدارة بنود التعاقد</h1>
            <p className="text-muted-foreground mt-1">إدارة وتنظيم بنود العقود حسب الخدمة والمدة</p>
          </div>
          
          <Button 
            onClick={openAddDialog}
            className="bg-gradient-primary text-primary-foreground rounded-xl shadow-glow-orange hover:opacity-90 h-11"
          >
            <Plus className="ml-2 h-5 w-5" />
            إضافة بند جديد
          </Button>
        </div>

        {/* Clauses Table */}
        <Card className="border-border overflow-hidden">
          <CardHeader>
            <CardTitle className="text-right">بنود التعاقد الحالية</CardTitle>
            <CardDescription className="text-right">
              قائمة بجميع بنود التعاقد المنظمة حسب الخدمة والمدة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="py-3 px-4 text-right font-medium text-muted-foreground">الترتيب</th>
                    <th className="py-3 px-4 text-right font-medium text-muted-foreground">الخدمة</th>
                    <th className="py-3 px-4 text-right font-medium text-muted-foreground">المدة</th>
                    <th className="py-3 px-4 text-right font-medium text-muted-foreground">نص البند</th>
                    <th className="py-3 px-4 text-right font-medium text-muted-foreground">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clauses
                    .sort((a, b) => a.order - b.order)
                    .map((clause) => (
                    <tr key={clause.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {clause.order}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-secondary/10 text-secondary">
                          {getServiceName(clause.serviceId)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="bg-accent/10 text-accent-foreground">
                          {getDurationLabel(clause.durationMonths)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 max-w-md">
                        <p className="text-sm line-clamp-2">{clause.clauseText}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg border-border hover:bg-muted/50"
                            onClick={() => openEditDialog(clause)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg border-destructive/50 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(clause.id)}
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
          </CardContent>
        </Card>

        {/* Add/Edit Clause Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                {editingClause ? "تعديل البند" : "إضافة بند جديد"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Selection */}
                <div className="space-y-2">
                  <Label htmlFor="serviceId" className="text-right block">الخدمة المرتبطة</Label>
                  <Select 
                    value={formData.serviceId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}
                  >
                    <SelectTrigger id="serviceId" className="bg-muted/50 border-border rounded-lg">
                      <SelectValue placeholder="اختر الخدمة" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockServices.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration Selection */}
                <div className="space-y-2">
                  <Label htmlFor="durationMonths" className="text-right block">مدة التعاقد</Label>
                  <Select 
                    value={formData.durationMonths} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, durationMonths: value }))}
                  >
                    <SelectTrigger id="durationMonths" className="bg-muted/50 border-border rounded-lg">
                      <SelectValue placeholder="اختر المدة" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractDurations.map((duration) => (
                        <SelectItem key={duration.months} value={duration.months.toString()}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Order */}
                <div className="space-y-2">
                  <Label htmlFor="order" className="text-right block">الترتيب</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
                    className="text-right bg-muted/50 border-border rounded-lg"
                    placeholder="ترتيب البند في العقد"
                    required
                  />
                </div>
              </div>

              {/* Clause Text */}
              <div className="space-y-2">
                <Label htmlFor="clauseText" className="text-right block">البند</Label>
                <Textarea
                  id="clauseText"
                  name="clauseText"
                  value={formData.clauseText}
                  onChange={(e) => setFormData(prev => ({ ...prev, clauseText: e.target.value }))}
                  className="text-right bg-muted/50 border-border rounded-lg min-h-[120px]"
                  placeholder="أدخل نص البند التفصيلي..."
                  required
                />
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
                  {editingClause ? "تحديث البند" : "إضافة البند"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ContractClauses;
