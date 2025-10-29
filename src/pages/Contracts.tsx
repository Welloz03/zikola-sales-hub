import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, CheckCircle, XCircle, Clock, Printer, Save, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock data for contracts
const mockContracts = [
  {
    id: "CON-2025-001",
    clientName: "شركة التقنية المتقدمة",
    packageName: "باقة ذهبية - تسويق رقمي",
    salesAgent: "خالد أحمد",
    totalAmount: 15000,
    status: "مكتمل",
    date: "2025-09-10",
    contractScope: "تطوير استراتيجية تسويق رقمي شاملة تشمل إدارة وسائل التواصل الاجتماعي وتحسين محركات البحث مع تقديم تقارير شهرية مفصلة.",
    clauses: [
      "تضمين خدمة SEO مع تحليل الكلمات المفتاحية",
      "صيانة مجانية لمدة 3 أشهر",
      "تحسين محركات البحث",
      "إدارة وسائل التواصل الاجتماعي",
      "تحليلات شهرية مفصلة",
      "دعم فني على مدار الساعة"
    ],
    editHistory: [
      { date: "2025-09-10", action: "إنشاء العقد", user: "خالد أحمد" },
      { date: "2025-09-10", action: "موافقة على العقد", user: "أحمد محمد" }
    ]
  },
  {
    id: "CON-2025-002",
    clientName: "مؤسسة الابتكار",
    packageName: "تطوير تطبيق أصلي",
    salesAgent: "سارة محمد",
    totalAmount: 28000,
    status: "قيد المراجعة",
    date: "2025-09-12",
    contractScope: "تطوير تطبيق جوال أصلي لنظام iOS و Android مع تصميم UI/UX مخصص وتطوير Backend API مع اختبارات شاملة.",
    clauses: [
      "تطوير تطبيق أصلي لنظام iOS و Android",
      "تصميم UI/UX مخصص",
      "تطوير Backend API",
      "اختبارات شاملة للجودة",
      "نشر على متاجر التطبيقات",
      "صيانة لمدة 6 أشهر"
    ],
    editHistory: [
      { date: "2025-09-12", action: "إنشاء العقد", user: "سارة محمد" },
      { date: "2025-09-13", action: "طلب إضافة خدمة CRO", user: "سارة محمد" }
    ]
  },
  {
    id: "CON-2025-003",
    clientName: "شركة النجاح التجاري",
    packageName: "باقة فضية - SEO",
    salesAgent: "محمد علي",
    totalAmount: 8500,
    status: "مرفوض",
    date: "2025-09-08",
    contractScope: "خدمات تحسين محركات البحث (SEO) مع تحليل شامل للموقع وتطوير استراتيجية الكلمات المفتاحية.",
    clauses: [
      "تحليل شامل للموقع الحالي",
      "تطوير استراتيجية الكلمات المفتاحية",
      "تحسين محتوى الموقع",
      "بناء الروابط الخلفية",
      "تقارير شهرية عن الأداء"
    ],
    editHistory: [
      { date: "2025-09-08", action: "إنشاء العقد", user: "محمد علي" },
      { date: "2025-09-09", action: "رفض العقد - سعر غير مناسب", user: "أحمد محمد" }
    ]
  },
  {
    id: "CON-2025-004",
    clientName: "مؤسسة الريادة",
    packageName: "باقة بلاتينية - تسويق شامل",
    salesAgent: "خالد أحمد",
    totalAmount: 35000,
    status: "قيد المراجعة",
    date: "2025-09-15",
    contractScope: "حزمة تسويق رقمي شاملة تشمل جميع الخدمات من تطوير الموقع إلى الإعلانات الممولة مع إدارة كاملة للحملات التسويقية.",
    clauses: [
      "تطوير موقع ويب متجاوب",
      "إدارة وسائل التواصل الاجتماعي",
      "حملات إعلانية ممولة",
      "تحسين محركات البحث",
      "تحليلات وتقارير شهرية",
      "دعم فني متقدم"
    ],
    editHistory: [
      { date: "2025-09-15", action: "إنشاء العقد", user: "خالد أحمد" }
    ]
  },
  {
    id: "CON-2025-005",
    clientName: "شركة الأفق الجديد",
    packageName: "باقة ذهبية - تطوير ويب",
    salesAgent: "سارة محمد",
    totalAmount: 22000,
    status: "مكتمل",
    date: "2025-09-05",
    contractScope: "تطوير موقع ويب متكامل مع نظام إدارة محتوى مخصص وتكامل مع أنظمة الدفع الإلكتروني.",
    clauses: [
      "تطوير موقع ويب متجاوب",
      "نظام إدارة محتوى مخصص",
      "تكامل مع أنظمة الدفع",
      "تحسين الأداء والسرعة",
      "تدريب فريق العمل",
      "صيانة لمدة سنة"
    ],
    editHistory: [
      { date: "2025-09-05", action: "إنشاء العقد", user: "سارة محمد" },
      { date: "2025-09-06", action: "موافقة على العقد", user: "أحمد محمد" }
    ]
  }
];

const Contracts = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contracts, setContracts] = useState(mockContracts);
  
  // Form state for editing contract
  const [editFormData, setEditFormData] = useState({
    clientName: "",
    contractScope: "",
    clauses: [] as string[],
    status: ""
  });

  // Filter contracts based on search query
  const filteredContracts = contracts.filter(contract =>
    contract.clientName.includes(searchQuery) || 
    contract.packageName.includes(searchQuery) ||
    contract.id.includes(searchQuery)
  );

  // Open contract detail modal
  const openContractModal = (contract: any) => {
    setSelectedContract(contract);
    setEditFormData({
      clientName: contract.clientName,
      contractScope: contract.contractScope,
      clauses: [...contract.clauses],
      status: contract.status
    });
    setIsDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle clause changes
  const handleClauseChange = (index: number, value: string) => {
    const newClauses = [...editFormData.clauses];
    newClauses[index] = value;
    setEditFormData(prev => ({ ...prev, clauses: newClauses }));
  };

  // Add new clause
  const addNewClause = () => {
    setEditFormData(prev => ({ 
      ...prev, 
      clauses: [...prev.clauses, "بند جديد"] 
    }));
  };

  // Remove clause
  const removeClause = (index: number) => {
    const newClauses = editFormData.clauses.filter((_, i) => i !== index);
    setEditFormData(prev => ({ ...prev, clauses: newClauses }));
  };

  // Handle print action
  const handlePrint = () => {
    // Simulate print action
    window.print();
    toast({
      title: "تم بدء الطباعة",
      description: "سيتم طباعة العقد في نافذة جديدة",
    });
  };

  // Handle save changes with audit tracking
  const handleSaveChanges = () => {
    // Update contract data
    const updatedContracts = contracts.map(contract => 
      contract.id === selectedContract.id 
        ? { 
            ...contract, 
            clientName: editFormData.clientName,
            contractScope: editFormData.contractScope,
            clauses: editFormData.clauses,
            status: editFormData.status,
            editHistory: [
              ...contract.editHistory,
              { 
                date: new Date().toLocaleDateString('ar-SA'), 
                action: "تعديل بيانات العقد", 
                user: "أحمد محمد (مدير المبيعات)" 
              }
            ]
          }
        : contract
    );
    
    setContracts(updatedContracts);
    setSelectedContract(updatedContracts.find(c => c.id === selectedContract.id));
    
    toast({
      title: "تم حفظ التعديلات بنجاح",
      description: "تم حفظ التعديلات بنجاح. تم تسجيل التغييرات في سجل التدقيق.",
    });
  };

  // Handle contract approval
  const handleApprove = (contractId: string) => {
    const updatedContracts = contracts.map(contract => 
      contract.id === contractId 
        ? { 
            ...contract, 
            status: "مكتمل",
            editHistory: [
              ...contract.editHistory,
              { 
                date: new Date().toLocaleDateString('ar-SA'), 
                action: "موافقة على العقد", 
                user: "أحمد محمد (مدير المبيعات)" 
              }
            ]
          }
        : contract
    );
    
    setContracts(updatedContracts);
    toast({
      title: "تمت الموافقة على العقد",
      description: `تم قبول العقد رقم ${contractId} بنجاح`,
    });
    setIsDialogOpen(false);
  };

  // Handle contract rejection
  const handleReject = (contractId: string) => {
    const updatedContracts = contracts.map(contract => 
      contract.id === contractId 
        ? { 
            ...contract, 
            status: "مرفوض",
            editHistory: [
              ...contract.editHistory,
              { 
                date: new Date().toLocaleDateString('ar-SA'), 
                action: "رفض العقد", 
                user: "أحمد محمد (مدير المبيعات)" 
              }
            ]
          }
        : contract
    );
    
    setContracts(updatedContracts);
    toast({
      title: "تم رفض العقد",
      description: `تم رفض العقد رقم ${contractId}`,
      variant: "destructive",
    });
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">📄 إدارة العقود</h1>
            <p className="text-muted-foreground mt-1">مراجعة وإدارة عقود المبيعات</p>
          </div>
          
          <div className="relative w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث في العقود..."
              className="pr-10 bg-muted/50 border-border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Contracts Table */}
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">رقم العقد</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">العميل</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">الباقة</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">وكيل المبيعات</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">المبلغ</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">التاريخ</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">الحالة</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{contract.id}</td>
                    <td className="py-3 px-4">{contract.clientName}</td>
                    <td className="py-3 px-4">{contract.packageName}</td>
                    <td className="py-3 px-4">{contract.salesAgent}</td>
                    <td className="py-3 px-4 font-medium">{contract.totalAmount.toLocaleString()} ر.س</td>
                    <td className="py-3 px-4">{contract.date}</td>
                    <td className="py-3 px-4">
                      <Badge className={`
                        ${contract.status === "مكتمل" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : 
                          contract.status === "قيد المراجعة" ? "bg-primary/10 text-primary hover:bg-primary/20" : 
                          "bg-destructive/10 text-destructive hover:bg-destructive/20"}
                      `}>
                        {contract.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-lg hover:bg-muted/50"
                        onClick={() => openContractModal(contract)}
                      >
                        <Edit className="ml-1 h-4 w-4" />
                        عرض/تعديل
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Contract Detail & Edit Modal */}
        {selectedContract && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-card border-border max-w-5xl max-h-[95vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  تفاصيل العقد {selectedContract.id}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Action Bar */}
                <div className="flex justify-between items-center p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                  <div className="flex gap-3">
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      className="rounded-lg border-border hover:bg-muted/50"
                    >
                      <Printer className="ml-2 h-5 w-5" />
                      طباعة العقد
                    </Button>
                    <Button
                      onClick={handleSaveChanges}
                      className="bg-gradient-primary text-primary-foreground rounded-lg shadow-glow-orange hover:opacity-90"
                    >
                      <Save className="ml-2 h-5 w-5" />
                      حفظ التعديلات
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    آخر تعديل: {selectedContract.editHistory[selectedContract.editHistory.length - 1]?.date}
                  </div>
                </div>

                {/* Contract Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-4 border-border bg-muted/30">
                    <h3 className="font-semibold mb-3 text-lg">معلومات العقد</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientName" className="text-right block">اسم العميل</Label>
                        <Input
                          id="clientName"
                          name="clientName"
                          value={editFormData.clientName}
                          onChange={handleInputChange}
                          className="text-right bg-muted/50 border-border rounded-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-right block">حالة العقد</Label>
                        <Select 
                          value={editFormData.status} 
                          onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger className="bg-muted/50 border-border rounded-lg">
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                            <SelectItem value="مكتمل">مكتمل</SelectItem>
                            <SelectItem value="مرفوض">مرفوض</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-right block">الباقة</Label>
                        <Input
                          value={selectedContract.packageName}
                          disabled
                          className="text-right bg-muted/30 border-border rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-right block">وكيل المبيعات</Label>
                        <Input
                          value={selectedContract.salesAgent}
                          disabled
                          className="text-right bg-muted/30 border-border rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-right block">المبلغ الإجمالي</Label>
                        <Input
                          value={`${selectedContract.totalAmount.toLocaleString()} ر.س`}
                          disabled
                          className="text-right bg-muted/30 border-border rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-right block">تاريخ الإنشاء</Label>
                        <Input
                          value={selectedContract.date}
                          disabled
                          className="text-right bg-muted/30 border-border rounded-lg"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Contract Scope */}
                  <Card className="p-4 border-border bg-muted/30">
                    <h3 className="font-semibold mb-3 text-lg">نطاق العقد</h3>
                    <div className="space-y-2">
                      <Label htmlFor="contractScope" className="text-right block">وصف نطاق العمل</Label>
                      <Textarea
                        id="contractScope"
                        name="contractScope"
                        value={editFormData.contractScope}
                        onChange={handleInputChange}
                        className="text-right bg-muted/50 border-border rounded-lg min-h-[200px]"
                        placeholder="أدخل وصف مفصل لنطاق العمل..."
                      />
                    </div>
                  </Card>
                </div>

                {/* Contract Clauses */}
                <Card className="p-4 border-border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">بنود العقد</h3>
                    <Button
                      onClick={addNewClause}
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-border hover:bg-muted/50"
                    >
                      <Edit className="ml-1 h-4 w-4" />
                      إضافة بند
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {editFormData.clauses.map((clause, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                        <Checkbox checked disabled className="mt-1" />
                        <div className="flex-1">
                          <Textarea
                            value={clause}
                            onChange={(e) => handleClauseChange(index, e.target.value)}
                            className="text-right bg-muted/50 border-border rounded-lg min-h-[60px] resize-none"
                            placeholder="أدخل نص البند..."
                          />
                        </div>
                        <Button
                          onClick={() => removeClause(index)}
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-destructive/50 text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Edit History / Audit Trail */}
                <Card className="p-4 border-border">
                  <h3 className="font-semibold mb-4 text-lg">سجل التعديلات</h3>
                  <div className="space-y-4">
                    {selectedContract.editHistory.map((edit: any, index: number) => (
                      <div key={index} className="relative pr-6 pb-6 border-r border-border last:pb-0">
                        <div className="absolute right-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                        <div className="mb-1 text-sm text-muted-foreground">{edit.date}</div>
                        <div className="font-medium">{edit.action}</div>
                        <div className="text-sm text-muted-foreground">بواسطة: {edit.user}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Action Buttons */}
                {selectedContract.status === "قيد المراجعة" && (
                  <div className="flex justify-end gap-3 mt-4">
                    <Button
                      variant="outline"
                      className="rounded-lg border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={() => handleReject(selectedContract.id)}
                    >
                      <XCircle className="ml-2 h-5 w-5" />
                      رفض العقد
                    </Button>
                    <Button
                      className="bg-gradient-primary text-primary-foreground rounded-lg shadow-glow-orange hover:opacity-90"
                      onClick={() => handleApprove(selectedContract.id)}
                    >
                      <CheckCircle className="ml-2 h-5 w-5" />
                      موافقة على العقد
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Contracts;