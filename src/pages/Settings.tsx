import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Moon, Sun } from "lucide-react";

const Settings = () => {
  const [role] = useState<"admin" | "agent">("admin");
  
  return (
    <DashboardLayout role={role}>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">الإعدادات</h1>
        
        <Tabs defaultValue="general" dir="rtl" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="general">الإعدادات العامة</TabsTrigger>
            <TabsTrigger value="system">إعدادات النظام</TabsTrigger>
            <TabsTrigger value="appearance">المظهر والإشعارات</TabsTrigger>
          </TabsList>
          
          {/* General Settings Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">الإعدادات العامة</CardTitle>
                <CardDescription className="text-right">
                  إدارة إعدادات اللغة ومعلومات الشركة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-right block">اللغة الافتراضية</Label>
                    <Select defaultValue="ar">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر اللغة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-right block">اسم الشركة</Label>
                    <Input placeholder="أدخل اسم الشركة" defaultValue="زيكولا للمبيعات" className="text-right" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-right block">عنوان الشركة</Label>
                    <Input placeholder="أدخل عنوان الشركة" defaultValue="الرياض، المملكة العربية السعودية" className="text-right" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-right block">وصف الشركة</Label>
                    <Textarea 
                      placeholder="أدخل وصف الشركة" 
                      defaultValue="منصة زيكولا لإدارة المبيعات وتتبع أداء وكلاء المبيعات وإدارة العقود بكفاءة عالية."
                      className="text-right min-h-[100px]" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* System Settings Tab */}
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">إعدادات النظام</CardTitle>
                <CardDescription className="text-right">
                  إدارة إعدادات الموافقات وتحرير العقود ودورة الأداء
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Switch id="addon-approval" defaultChecked />
                  <Label htmlFor="addon-approval" className="text-right flex-1">
                    طلب موافقة المدير على الإضافات
                  </Label>
                </div>
                
                <div className="flex items-center justify-between">
                  <Switch id="contract-editing" defaultChecked />
                  <Label htmlFor="contract-editing" className="text-right flex-1">
                    السماح للوكلاء بطلب تعديل العقود بعد التقديم
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-right block">يوم بدء دورة أداء المبيعات</Label>
                  <Select defaultValue="1">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر اليوم" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(28)].map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Appearance & Notifications Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">المظهر والإشعارات</CardTitle>
                <CardDescription className="text-right">
                  إدارة إعدادات المظهر والإشعارات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-right">الإشعارات</h3>
                  
                  <div className="flex items-center justify-between">
                    <Switch id="new-contract-notification" defaultChecked />
                    <Label htmlFor="new-contract-notification" className="text-right flex-1">
                      تنبيه عند إرسال عقد جديد
                    </Label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Switch id="contract-expiry-notification" defaultChecked />
                    <Label htmlFor="contract-expiry-notification" className="text-right flex-1">
                      تنبيه عند اقتراب انتهاء عقد
                    </Label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Switch id="approval-notification" defaultChecked />
                    <Label htmlFor="approval-notification" className="text-right flex-1">
                      تنبيه عند الموافقة على طلب
                    </Label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Switch id="rejection-notification" defaultChecked />
                    <Label htmlFor="rejection-notification" className="text-right flex-1">
                      تنبيه عند رفض طلب
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium text-right">المظهر</h3>
                  
                  <div className="flex justify-end">
                    <ToggleGroup type="single" defaultValue="dark" className="justify-end">
                      <ToggleGroupItem value="light" aria-label="Light Mode">
                        <Sun className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="dark" aria-label="Dark Mode">
                        <Moon className="h-4 w-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;