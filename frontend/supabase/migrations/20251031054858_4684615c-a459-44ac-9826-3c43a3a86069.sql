-- إنشاء جدول الملفات الشخصية
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول الحملات
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول أعضاء الحملات
CREATE TABLE IF NOT EXISTS public.campaign_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);

-- تفعيل RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_members ENABLE ROW LEVEL SECURITY;

-- سياسات profiles
CREATE POLICY "المستخدمون يمكنهم رؤية ملفاتهم الشخصية"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "المستخدمون يمكنهم تحديث ملفاتهم الشخصية"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "إنشاء الملف الشخصي تلقائياً"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- سياسات campaigns
CREATE POLICY "المستخدمون يمكنهم رؤية حملاتهم"
  ON public.campaigns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members
      WHERE campaign_members.campaign_id = campaigns.id
      AND campaign_members.user_id = auth.uid()
    )
  );

CREATE POLICY "المستخدمون يمكنهم إنشاء حملات"
  ON public.campaigns FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "المالكون والمسؤولون يمكنهم تحديث الحملات"
  ON public.campaigns FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members
      WHERE campaign_members.campaign_id = campaigns.id
      AND campaign_members.user_id = auth.uid()
      AND campaign_members.role IN ('owner', 'admin')
    )
  );

-- سياسات campaign_members
CREATE POLICY "الأعضاء يمكنهم رؤية أعضاء حملاتهم"
  ON public.campaign_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.campaign_id = campaign_members.campaign_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "المالكون يمكنهم إضافة أعضاء"
  ON public.campaign_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE campaigns.id = campaign_members.campaign_id
      AND campaigns.created_by = auth.uid()
    )
  );

-- دالة لإنشاء الملف الشخصي تلقائياً
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- مشغل لإنشاء الملف الشخصي
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- دالة لتحديث updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- مشغلات لتحديث updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();