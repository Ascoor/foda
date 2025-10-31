import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CampaignsCarousel from "../components/CampaignsCarousel";
import { campaignsApi, type Campaign } from "../../../shared/api/campaigns.service";

export default function CampaignsIndex() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => campaignsApi.list(),
  });

  if (isLoading) {
    return <div className="p-6">Loading campaigns…</div>;
  }

  const items: Campaign[] = data?.data ?? [];

  if (!items.length) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">لا توجد حملات</h2>
        <p className="opacity-70">ابدأ بإنشاء حملة جديدة.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">حملاتك</h1>
      </div>
      <CampaignsCarousel items={items} onOpen={(id) => navigate(`/c/${id}/dashboard`)} />
    </div>
  );
}
