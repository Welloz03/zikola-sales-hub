import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckCircle2, 
  Package, 
  User, 
  Mail, 
  Phone, 
  Building,
  ArrowRight,
  ArrowLeft,
  Tag,
  Plus,
  FileText,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { apiService } from "@/lib/api";

const CreateContract = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Fetch packages using React Query
  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: apiService.getPackages,
  });

  // Create contract mutation
  const createContractMutation = useMutation({
    mutationFn: apiService.createContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast({
        title: "تم إنشاء العقد",
        description: "تم إرسال العقد للمراجعة بنجاح",
      });
      navigate("/agent/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إنشاء العقد",
        description: error.response?.data?.message || "حدث خطأ أثناء إنشاء العقد",
        variant: "destructive",
      });
    },
  });

  const addons = [
    { id: 1, name: "الدعم الفني المتقدم", price: 5000, description: "دعم فني على مدار الساعة" },
    { id: 2, name: "خدمات CRO", price: 8000, description: "تحسين معدل التحويل" },
  ];

  // Mock contract clauses data (same as in ContractClauses.tsx)
  const contractClauses = [
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

  // Service mapping for packages
  const serviceMapping = {
    1: [1, 2, 3, 4, 5], // الباقة الذهبية - تسويق متكامل
    2: [2, 3], // الباقة الفضية - تسويق رقمي  
    3: [1, 4] // باقة تطوير التطبيقات
  };

  // Get duration in months from package duration string
  const getDurationMonths = (duration: string) => {
    if (duration.includes("12")) return 12;
    if (duration.includes("9")) return 9;
    if (duration.includes("6")) return 6;
    if (duration.includes("3")) return 3;
    return 12; // default
  };

  // Get automatic contract clauses based on selected package
  const getAutomaticClauses = () => {
    if (!selectedPackage) return [];
    
    const packageServiceIds = serviceMapping[selectedPackage.id as keyof typeof serviceMapping] || [];
    const durationMonths = getDurationMonths(selectedPackage.duration);
    
    return contractClauses
      .filter(clause => 
        packageServiceIds.includes(clause.serviceId) && 
        clause.durationMonths === durationMonths
      )
      .sort((a, b) => a.order - b.order);
  };

  const handleAddonToggle = (addonId: number) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const applyCoupon = () => {
    if (couponCode === "ZIKOLA10") {
      setDiscount(10);
      toast({
        title: "تم تطبيق الكوبون",
        description: "حصلت على خصم 10%",
      });
    } else {
      toast({
        title: "كوبون غير صحيح",
        description: "الرجاء التحقق من الكود",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    
    let total = selectedPackage.price;
    
    selectedAddons.forEach(addonId => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) total += addon.price;
    });
    
    if (discount > 0) {
      total = total * (1 - discount / 100);
    }
    
    return total;
  };

  const handleSubmit = () => {
    if (!selectedPackage) return;

    const contractData = {
      packageId: selectedPackage.id,
      customerName: (document.getElementById('customerName') as HTMLInputElement)?.value || '',
      customerEmail: (document.getElementById('email') as HTMLInputElement)?.value || '',
      customerPhone: (document.getElementById('phone') as HTMLInputElement)?.value || '',
      companyName: (document.getElementById('company') as HTMLInputElement)?.value || '',
      selectedAddons: selectedAddons,
      couponCode: couponCode,
      calculatedTotal: calculateTotal(),
    };

    createContractMutation.mutate(contractData);
  };

  return (
    <DashboardLayout role="agent">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[
            { num: 1, label: "اختيار الباقة" },
            { num: 2, label: "بيانات العميل" },
            { num: 3, label: "المراجعة" },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  step >= s.num 
                    ? "bg-gradient-primary text-primary-foreground shadow-glow-orange" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {step > s.num ? <CheckCircle2 className="h-6 w-6" /> : s.num}
                </div>
                <p className="text-sm mt-2 font-semibold text-center">{s.label}</p>
              </div>
              {idx < 2 && (
                <div className={`h-1 flex-1 mx-2 rounded transition-all ${
                  step > s.num ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Package Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">اختر الباقة المناسبة</h2>
              <p className="text-muted-foreground">اختر الباقة التي تناسب احتياجات العميل</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {packagesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="p-6 bg-gradient-card border-border">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-muted-foreground">جاري تحميل الباقات...</span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`p-6 cursor-pointer transition-all ${
                    selectedPackage?.id === pkg.id
                      ? "bg-gradient-primary/10 border-primary shadow-glow-orange"
                      : "bg-gradient-card border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Package className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">المدة:</span>
                          <span className="font-semibold">{pkg.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">السعر:</span>
                          <span className="font-bold text-primary">{pkg.price.toLocaleString()} ر.س</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {pkg.services.map((service, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedPackage?.id === pkg.id && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </Card>
                ))
              )}
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!selectedPackage}
              className="w-full h-12 bg-gradient-primary text-primary-foreground rounded-xl shadow-glow-orange hover:opacity-90"
            >
              <span>التالي</span>
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Step 2: Customer Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">بيانات العميل</h2>
              <p className="text-muted-foreground">أدخل معلومات العميل</p>
            </div>

            <Card className="p-6 bg-gradient-card border-border">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">اسم العميل</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="customerName"
                        placeholder="الاسم الكامل"
                        className="pr-10 bg-muted/50 border-border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">اسم الشركة</Label>
                    <div className="relative">
                      <Building className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="company"
                        placeholder="اسم الشركة"
                        className="pr-10 bg-muted/50 border-border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@company.com"
                        className="pr-10 bg-muted/50 border-border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الجوال</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="05XXXXXXXX"
                        className="pr-10 bg-muted/50 border-border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Add-ons */}
                <div className="space-y-3 pt-4">
                  <Label>إضافات اختيارية (تحتاج موافقة المدير)</Label>
                  {addons.map((addon) => (
                    <Card key={addon.id} className="p-4 bg-muted/30 border-border">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedAddons.includes(addon.id)}
                            onCheckedChange={() => handleAddonToggle(addon.id)}
                          />
                          <div>
                            <p className="font-semibold text-foreground">{addon.name}</p>
                            <p className="text-sm text-muted-foreground">{addon.description}</p>
                          </div>
                        </div>
                        <span className="font-bold text-primary whitespace-nowrap">
                          +{addon.price.toLocaleString()} ر.س
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Coupon */}
                <div className="space-y-2 pt-4">
                  <Label htmlFor="coupon">كود الخصم</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="coupon"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="أدخل كود الخصم"
                        className="pr-10 bg-muted/50 border-border rounded-lg"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={applyCoupon}
                      variant="outline"
                      className="rounded-lg border-border"
                    >
                      تطبيق
                    </Button>
                  </div>
                </div>
              </form>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-border"
              >
                <ArrowRight className="ml-2 h-5 w-5" />
                <span>السابق</span>
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 h-12 bg-gradient-primary text-primary-foreground rounded-xl shadow-glow-orange hover:opacity-90"
              >
                <span>التالي</span>
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">مراجعة العقد</h2>
              <p className="text-muted-foreground">تأكد من صحة البيانات قبل الإرسال</p>
            </div>

            <Card className="p-6 bg-gradient-card border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">تفاصيل الباقة</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الباقة</span>
                  <span className="font-semibold">{selectedPackage?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">السعر الأساسي</span>
                  <span className="font-semibold">{selectedPackage?.price.toLocaleString()} ر.س</span>
                </div>
                {selectedAddons.length > 0 && (
                  <>
                    {selectedAddons.map(addonId => {
                      const addon = addons.find(a => a.id === addonId);
                      return (
                        <div key={addonId} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">+ {addon?.name}</span>
                          <span>{addon?.price.toLocaleString()} ر.س</span>
                        </div>
                      );
                    })}
                  </>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>خصم {discount}%</span>
                    <span>-{((selectedPackage?.price || 0) * discount / 100).toLocaleString()} ر.س</span>
                  </div>
                )}
                <div className="pt-3 border-t border-border flex justify-between">
                  <span className="text-xl font-bold">الإجمالي</span>
                  <span className="text-2xl font-bold text-primary">{calculateTotal().toLocaleString()} ر.س</span>
                </div>
              </div>
            </Card>

            {/* Automatic Contract Clauses */}
            <Card className="p-6 bg-gradient-card border-border">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold text-foreground">بنود العقد التلقائية</h3>
              </div>
              <div className="space-y-3">
                {getAutomaticClauses().length > 0 ? (
                  getAutomaticClauses().map((clause) => (
                    <div key={clause.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                      <Checkbox checked disabled className="mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{clause.clauseText}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>لا توجد بنود تلقائية متطابقة مع هذه الباقة والمدة</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-secondary/10 border-secondary/20">
              <p className="text-sm text-foreground">
                ⚠️ سيتم إرسال هذا العقد للمراجعة والموافقة من قبل مدير المبيعات
                {selectedAddons.length > 0 && " (يتضمن إضافات تحتاج موافقة)"}
              </p>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-border"
              >
                <ArrowRight className="ml-2 h-5 w-5" />
                <span>السابق</span>
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createContractMutation.isPending}
                className="flex-1 h-12 bg-gradient-secondary text-secondary-foreground rounded-xl shadow-glow-purple hover:opacity-90 disabled:opacity-50"
              >
                {createContractMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <span>إرسال للمراجعة</span>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateContract;
