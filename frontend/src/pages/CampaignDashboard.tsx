import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNewAuth as useAuth } from "@/shared/contexts/AuthContext";
import { request } from "@/shared/lib/api";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { ArrowLeft, Users, MapPin, CheckSquare, BarChart3, Hash } from "lucide-react";
import { toast } from "sonner";

interface Campaign {
  id: number | string;
  name: string;
  description?: string | null;
  election_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const extractCampaign = (data: unknown): Campaign | null => {
  if (!data) return null;

  if (typeof data === "object" && "data" in data) {
    const inner = (data as { data?: unknown }).data;
    if (inner && typeof inner === "object") {
      return inner as Campaign;
    }
  }

  return data as Campaign;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "";

  try {
    return new Date(value).toLocaleString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value ?? "";
  }
};

export const CampaignDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await request<Campaign | { data: Campaign }>({
        url: `/ec/campaigns/${id}`,
        method: "get",
      });

      const normalized = extractCampaign(data);

      if (!normalized) {
        throw new Error("تعذر تحميل بيانات الحملة");
      }

      setCampaign(normalized);
    } catch (error) {
      toast.error("فشل تحميل بيانات الحملة");
      console.error(error);
      navigate("/campaigns/gateway");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/campaigns/gateway")}
              className="mb-4"
            >
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة للحملات
            </Button>
            <h1 className="text-4xl font-bold text-gradient-primary mb-2">
              {campaign?.name}
            </h1>
            <p className="text-muted-foreground">
              {campaign?.description || "لوحة التحكم الرئيسية للحملة"}
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary flex items-center gap-1">
                <Hash className="h-3 w-3" />
                {`معرّف الحملة: ${campaign?.id ?? "غير متاح"}`}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-success/20 text-success">
                {campaign?.election_id
                  ? `مرتبطة بالانتخابات رقم ${campaign.election_id}`
                  : "بدون انتخابات مرتبطة"}
              </span>
              {campaign?.updated_at && (
                <span className="text-xs px-3 py-1 rounded-full bg-muted/40 text-muted-foreground">
                  {`آخر تحديث: ${formatDateTime(campaign.updated_at)}`}
                </span>
              )}
            </div>
          </div>
          <Button onClick={signOut} variant="outline" className="glass-button">
            تسجيل الخروج
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">المناطق</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">منطقة انتخابية</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">المتطوعون</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">324</div>
              <p className="text-xs text-muted-foreground">متطوع نشط</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">المهام</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground">مهمة قيد التنفيذ</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">معدل الإنجاز</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">73%</div>
              <p className="text-xs text-muted-foreground">من الأهداف</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>مرحباً بك في لوحة التحكم</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              هذه هي لوحة التحكم الرئيسية لحملتك الانتخابية. من هنا يمكنك:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>متابعة تقدم الأنشطة الانتخابية في الوقت الفعلي</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>إدارة المتطوعين والمناطق الجغرافية</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>مراقبة المهام والأنشطة الميدانية</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>تحليل البيانات واتخاذ القرارات المستنيرة</span>
              </li>
            </ul>
            <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium">💡 نصيحة</p>
              <p className="text-sm text-muted-foreground mt-1">
                استخدم القائمة الجانبية للانتقال بين الأقسام المختلفة لإدارة حملتك بكفاءة
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
