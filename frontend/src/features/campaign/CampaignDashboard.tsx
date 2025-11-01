import { useQuery } from "@tanstack/react-query";

import { fetchCampaignDashboard } from "@/shared/api/campaign";
import { useCampaignStore } from "@/shared/state/campaignStore";

function KPI({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
    </div>
  );
}

export default function CampaignDashboard() {
  const { campaignId } = useCampaignStore();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["campaign", "dashboard", campaignId],
    queryFn: () => fetchCampaignDashboard(campaignId!),
    enabled: Boolean(campaignId),
    staleTime: 60_000,
  });

  if (!campaignId) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 bg-white/60 p-6 text-sm text-muted-foreground dark:border-slate-700 dark:bg-slate-900/40">
        اختر حملة من القائمة العلوية لاستعراض مؤشرات الأداء الخاصة بها.
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="rounded-md border border-gray-200 bg-white/60 p-6 text-sm text-muted-foreground dark:border-slate-700 dark:bg-slate-900/40">
        جارِ تحميل مؤشرات الحملة…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-6 text-sm text-red-900">
        حدث خطأ أثناء تحميل المؤشرات: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">لوحة الحملة</h2>
        <p className="text-sm text-muted-foreground">
          لمحة سريعة عن أداء الحملة خلال الفترة الأخيرة.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI title="أنشطة آخر 7 أيام" value={data?.kpis.activities_last7 ?? 0} />
        <KPI title="رسائل اليوم" value={data?.kpis.sms_today ?? 0} />
      </div>
    </div>
  );
}
