import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Profile = () => {
  const { toast } = useToast();
  
  // Mock user data
  const [userData, setUserData] = useState({
    fullName: "أحمد محمد",
    email: "ahmed@zikola.com",
    role: "مدير المبيعات",
    company: "زيكولا الرئيسي"
  });

  // Form state for personal information
  const [personalInfo, setPersonalInfo] = useState({
    fullName: userData.fullName,
    email: userData.email
  });

  // Form state for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Handle personal information update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user data
    setUserData(prev => ({
      ...prev,
      fullName: personalInfo.fullName,
      email: personalInfo.email
    }));

    toast({
      title: "تم تحديث الملف الشخصي بنجاح",
      description: "تم حفظ التغييرات بنجاح",
    });
  };

  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمات المرور الجديدة غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    // Reset password form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    toast({
      title: "تم تغيير كلمة المرور بنجاح",
      description: "تم تحديث كلمة المرور بنجاح",
    });
  };

  // Handle input changes for personal info
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle input changes for password
  const handlePasswordChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">👤 الملف الشخصي</h1>
            <p className="text-muted-foreground mt-1">إدارة معلوماتك الشخصية وإعدادات الأمان</p>
          </div>

          {/* Main Profile Card */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-right">إعدادات الملف الشخصي</CardTitle>
              <CardDescription className="text-right">
                قم بتحديث معلوماتك الشخصية وإعدادات الأمان
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" dir="rtl" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="personal">المعلومات الشخصية</TabsTrigger>
                  <TabsTrigger value="security">الأمان وكلمة المرور</TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal">
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-right block">الاسم الكامل</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={personalInfo.fullName}
                          onChange={handlePersonalInfoChange}
                          className="text-right bg-muted/50 border-border rounded-lg"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          className="text-right bg-muted/50 border-border rounded-lg"
                          required
                        />
                      </div>

                      {/* Role (Read-only) */}
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-right block">الدور</Label>
                        <Input
                          id="role"
                          value={userData.role}
                          disabled
                          className="text-right bg-muted/30 border-border rounded-lg"
                        />
                      </div>

                      {/* Company (Read-only) */}
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-right block">الشركة</Label>
                        <Input
                          id="company"
                          value={userData.company}
                          disabled
                          className="text-right bg-muted/30 border-border rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        className="bg-gradient-primary text-primary-foreground rounded-lg shadow-glow-orange hover:opacity-90"
                      >
                        <Save className="ml-2 h-5 w-5" />
                        حفظ التغييرات
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Security & Password Tab */}
                <TabsContent value="security">
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="space-y-4">
                      {/* Current Password */}
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-right block">كلمة المرور الحالية</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChangeInput}
                          className="text-right bg-muted/50 border-border rounded-lg"
                          required
                        />
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-right block">كلمة المرور الجديدة</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChangeInput}
                          className="text-right bg-muted/50 border-border rounded-lg"
                          required
                        />
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-right block">تأكيد كلمة المرور الجديدة</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChangeInput}
                          className="text-right bg-muted/50 border-border rounded-lg"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        className="bg-gradient-secondary text-secondary-foreground rounded-lg shadow-glow-purple hover:opacity-90"
                      >
                        <KeyRound className="ml-2 h-5 w-5" />
                        تغيير كلمة المرور
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
