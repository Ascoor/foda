import React from 'react';
import { User, Globe, Palette, Bell, Shield, Database, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export const Settings: React.FC = () => {
  const { language, direction, t, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
          {t('nav.settings')}
        </h1>
        <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
          {language === 'ar' ? 'إدارة إعدادات التطبيق والملف الشخصي' : 'Manage your application settings and profile'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass transition-glow hover:neon-glow-blue">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
                <User className="h-5 w-5 text-primary" />
                {language === 'ar' ? 'الملف الشخصي' : 'Profile Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center gap-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {language === 'ar' ? 'م' : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="transition-glow hover:neon-glow-orange">
                    <span className={language === 'ar' ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'تغيير الصورة' : 'Change Photo'}
                    </span>
                  </Button>
                  <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? 'JPG أو PNG بحد أقصى 2 ميجابايت' : 'JPG or PNG, max 2MB'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className={language === 'ar' ? 'font-arabic' : ''}>
                    {language === 'ar' ? 'الاسم الأول' : 'First Name'}
                  </Label>
                  <Input className="glass" placeholder={language === 'ar' ? 'أحمد' : 'Ahmed'} />
                </div>
                <div>
                  <Label className={language === 'ar' ? 'font-arabic' : ''}>
                    {language === 'ar' ? 'الاسم الأخير' : 'Last Name'}
                  </Label>
                  <Input className="glass" placeholder={language === 'ar' ? 'محمد' : 'Mohammed'} />
                </div>
              </div>

              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </Label>
                <Input className="glass" type="email" placeholder="ahmed@fahsan.com" />
              </div>

              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </Label>
                <Input className="glass" placeholder="+966 50 123 4567" />
              </div>

              <Button className="transition-glow hover:neon-glow-blue">
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {t('common.save')}
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass transition-glow hover:neon-glow-orange">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
                <Bell className="h-5 w-5 text-secondary" />
                {language === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}
                  </p>
                  <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? 'تلقي إشعارات الحملات والتحديثات' : 'Receive campaign and update notifications'}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? 'إشعارات الهاتف' : 'Push Notifications'}
                  </p>
                  <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? 'تلقي إشعارات فورية على الهاتف' : 'Receive instant push notifications'}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? 'تقارير أسبوعية' : 'Weekly Reports'}
                  </p>
                  <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? 'تلقي ملخص أسبوعي لأداء الحملات' : 'Receive weekly campaign performance summary'}
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Settings */}
        <div className="space-y-6">
          <Card className="glass transition-glow hover:neon-glow-blue">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
                <Palette className="h-5 w-5 text-primary" />
                {language === 'ar' ? 'المظهر واللغة' : 'Appearance & Language'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? 'الوضع الليلي' : 'Dark Mode'}
                  </p>
                  <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {theme === 'dark' 
                      ? (language === 'ar' ? 'الوضع الليلي مفعل' : 'Dark mode enabled')
                      : (language === 'ar' ? 'الوضع النهاري مفعل' : 'Light mode enabled')
                    }
                  </p>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
              </div>

              <Separator />

              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'اللغة' : 'Language'}
                </Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={language === 'ar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLanguage('ar')}
                    className="transition-glow hover:neon-glow-orange"
                  >
                    العربية
                  </Button>
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLanguage('en')}
                    className="transition-glow hover:neon-glow-blue"
                  >
                    English
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass transition-glow hover:neon-glow-orange">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
                <Shield className="h-5 w-5 text-secondary" />
                {language === 'ar' ? 'الأمان والخصوصية' : 'Security & Privacy'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start transition-glow hover:neon-glow-blue">
                <Shield className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                </span>
              </Button>
              
              <Button variant="outline" className="w-full justify-start transition-glow hover:neon-glow-orange">
                <Database className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'تصدير البيانات' : 'Export Data'}
                </span>
              </Button>
              
              <Button variant="outline" className="w-full justify-start transition-glow hover:neon-glow-blue">
                <Globe className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'إعدادات الخصوصية' : 'Privacy Settings'}
                </span>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass transition-glow hover:neon-glow-blue">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
                <Mail className="h-5 w-5 text-info" />
                {language === 'ar' ? 'المساعدة والدعم' : 'Help & Support'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start transition-glow hover:neon-glow-orange">
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'مركز المساعدة' : 'Help Center'}
                </span>
              </Button>
              
              <Button variant="outline" className="w-full justify-start transition-glow hover:neon-glow-blue">
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'تواصل معنا' : 'Contact Support'}
                </span>
              </Button>
              
              <div className={`text-xs text-muted-foreground pt-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'الإصدار 1.0.0' : 'Version 1.0.0'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};