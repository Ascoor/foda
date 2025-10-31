import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { campaignsApi } from "../../../shared/api/campaigns.service";
import { useAuth } from "../../../shared/contexts/AuthContext";
import ElectionRibbon from "../components/ElectionRibbon";

export default function CampaignDashboard() {
  const { campaignId, electionId } = useParams();
  const id = Number(campaignId);
  const { me } = useAuth();

  const { data } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => campaignsApi.get(id),
    enabled: Number.isFinite(id) && id > 0,
  });

  const role = computeRoleFor(me, id);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{data?.name ?? "Campaign"}</h1>
          <p className="text-sm opacity-60">Role: {role}</p>
        </div>
      </div>
      <ElectionRibbon />
      <section className="grid md:grid-cols-3 gap-4">
        <div className="col-span-2 rounded border p-4">📈 KPIs / Summary</div>
        <div className="rounded border p-4">
          {role === "admin" && (
            <button className="w-full bg-black text-white rounded p-2">Settings</button>
          )}
          {role !== "viewer" && (
            <button className="mt-2 w-full border rounded p-2">Manage Widgets</button>
          )}
        </div>
      </section>
      {electionId && <div className="rounded border p-4">Election #{electionId} panels here…</div>}
    </div>
  );
}

type Me = ReturnType<typeof useAuth>["me"];

function computeRoleFor(me: Me, campaignId: number) {
  if (!me || !Number.isFinite(campaignId)) {
    return "viewer";
  }

  const campaignMembership = me.memberships?.find(
    (membership) => membership.scopeType === "campaign" && membership.scopeId === campaignId
  );
  if (campaignMembership) {
    return campaignMembership.role;
  }

  const areaMembership = me.memberships?.find((membership) => membership.scopeType === "area");
  return areaMembership?.role ?? "viewer";
}
