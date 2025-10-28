import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, CheckCircle, XCircle, Clock } from "lucide-react";
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
    editHistory: [
      { date: "2025-09-05", action: "إنشاء العقد", user: "سارة محمد" },
      { date: "2025-09-06", action: "موافقة على العقد", user: "أحمد محمد" }
    ]
  }
];

// Mock contract points for details modal
const mockContractPoints = [
  "تضمين خدمة SEO",
  "صيانة مجانية لمدة 3 أشهر",
  "تحسين محركات البحث",
  "إدارة وسائل التواصل الاجتماعي",
  "تحليلات شهرية",
  "دعم فني على مدار الساعة"
];

const Contracts = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter contracts based on search query
  const filteredContracts = mockContracts.filter(contract =>
    contract.clientName.includes(searchQuery) || 
    contract.packageName.includes(searchQuery) ||
    contract.id.includes(searchQuery)
  );

  // Handle contract approval
  const handleApprove = (contractId: string) => {
    toast({
      title: "تمت الموافقة على العقد",
      description: `تم قبول العقد رقم ${contractId} بنجاح`,
    });
    setIsDialogOpen(false);
  };

  // Handle contract rejection
  const handleReject = (contractId: string) => {
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
                        onClick={() => {
                          setSelectedContract(contract);
                          setIsDialogOpen(true);
                        }}
                      >
                        عرض التفاصيل
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Contract Details Dialog */}
        {selectedContract && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-card border-border max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  تفاصيل العقد {selectedContract.id}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Contract Info */}
                <div className="grid grid-cols-2 gap-6">
                  <Card className="p-4 border-border bg-muted/30">
                    <h3 className="font-semibold mb-3 text-lg">معلومات العقد</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">العميل:</span>
                        <span className="font-medium">{selectedContract.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الباقة:</span>
                        <span className="font-medium">{selectedContract.packageName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">وكيل المبيعات:</span>
                        <span className="font-medium">{selectedContract.salesAgent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">المبلغ الإجمالي:</span>
                        <span className="font-bold text-primary">{selectedContract.totalAmount.toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">تاريخ الإنشاء:</span>
                        <span className="font-medium">{selectedContract.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الحالة:</span>
                        <Badge className={`
                          ${selectedContract.status === "مكتمل" ? "bg-green-500/10 text-green-500" : 
                            selectedContract.status === "قيد المراجعة" ? "bg-primary/10 text-primary" : 
                            "bg-destructive/10 text-destructive"}
                        `}>
                          {selectedContract.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  {/* Contract Points */}
                  <Card className="p-4 border-border bg-muted/30">
                    <h3 className="font-semibold mb-3 text-lg">نقاط العقد</h3>
                    <div className="space-y-3">
                      {mockContractPoints.map((point, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Checkbox id={`point-${index}`} checked disabled />
                          <label htmlFor={`point-${index}`} className="text-sm font-medium">
                            {point}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

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