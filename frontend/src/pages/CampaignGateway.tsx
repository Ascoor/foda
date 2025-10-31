import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNewAuth as useAuth } from "@/shared/contexts/AuthContext";
import { request } from "@/shared/lib/api";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Skeleton } from "@/shared/ui/skeleton";
import { Plus, ArrowLeft, Megaphone, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

interface Campaign {
  id: number | string;
  name: string;
  description?: string | null;
  election_id?: number | null;
  created_at?: string | null;
}

const campaignSchema = z.object({
  name: z.string().min(3, "اسم الحملة يجب أن يكون 3 أحرف على الأقل").max(100),
  description: z.string().max(500, "الوصف يجب أن يكون أقل من 500 حرف"),
});

const normalizeCampaignResponse = (data: unknown): Campaign[] => {
  if (Array.isArray(data)) {
    return data as Campaign[];
  }

  if (data && typeof data === "object" && "data" in data) {
    const inner = (data as { data?: unknown }).data;
    return Array.isArray(inner) ? (inner as Campaign[]) : [];
  }

  return [];
};

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

const formatDate = (value?: string | null) => {
  if (!value) return "تاريخ غير متاح";
  try {
    return new Date(value).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
};

export const CampaignGateway = () => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCampaigns();
    }
  }, [isAuthenticated]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await request<Campaign[] | { data: Campaign[] }>({
        url: "/ec/campaigns",
        method: "get",
      });
      setCampaigns(normalizeCampaignResponse(data));
    } catch (error) {
      toast.error("فشل تحميل الحملات");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      campaignSchema.parse(formData);
      setSubmitting(true);

      const response = await request<Campaign | { data: Campaign }>({
        url: "/ec/campaigns",
        method: "post",
        data: {
          name: formData.name,
          description: formData.description,
        },
      });

      const newCampaign = extractCampaign(response);

      if (!newCampaign) {
        throw new Error("لم يتم إنشاء الحملة بنجاح");
      }

      toast.success("تم إنشاء الحملة بنجاح");
      setShowDialog(false);
      setFormData({ name: "", description: "" });
      setCampaigns((prev) => [newCampaign, ...prev]);
      navigate(`/campaigns/${newCampaign.id}/dashboard`);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: any = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(error?.message || "فشل إنشاء الحملة");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient-primary mb-2">
              اختر حملتك الانتخابية
            </h1>
            <p className="text-muted-foreground">
              اختر حملة موجودة أو أنش حملة جديدة للبدء
            </p>
          </div>
          <Button onClick={signOut} variant="outline" className="glass-button">
            <ArrowLeft className="ml-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-card">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {campaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="glass-card border-white/20 hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => navigate(`/campaigns/${campaign.id}/dashboard`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Megaphone className="h-8 w-8 text-primary mb-2" />
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(campaign.created_at)}
                      </span>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {campaign.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {campaign.description || "لا يوجد وصف"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-primary text-white">
                      فتح الحملة
                    </Button>
                  </CardContent>
                </Card>
              ))}

              <Card
                className="glass-card border-dashed border-2 border-primary/50 hover:border-primary transition-all cursor-pointer group"
                onClick={() => setShowDialog(true)}
              >
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[250px] p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">
                    إنشاء حملة جديدة
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    ابدأ حملة انتخابية جديدة من الصفر
                  </p>
                </CardContent>
              </Card>
            </div>

            {campaigns.length === 0 && (
              <Card className="glass-card text-center p-12">
                <Megaphone className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">لا توجد حملات بعد</h3>
                <p className="text-muted-foreground mb-6">
                  أنشئ حملتك الأولى للبدء في إدارة الأنشطة الانتخابية
                </p>
                <Button className="bg-gradient-primary text-white" onClick={() => setShowDialog(true)}>
                  إنشاء حملة جديدة
                </Button>
              </Card>
            )}
          </>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>إنشاء حملة جديدة</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم الحملة</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  dir="rtl"
                  className="glass border-white/20"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  dir="rtl"
                  className="glass border-white/20"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={submitting} className="bg-gradient-primary text-white">
                  {submitting ? "جاري الإنشاء..." : "إنشاء"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
