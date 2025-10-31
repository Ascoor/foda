import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { useNavigate, useParams } from "react-router-dom";
import { electionsApi, type Election } from "../../../shared/api/elections.service";

export default function ElectionRibbon() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  if (!campaignId) {
    return null;
  }

  const campaign = Number(campaignId);
  if (!Number.isFinite(campaign) || campaign <= 0) {
    return null;
  }

  const { data } = useQuery({
    queryKey: ["elections", campaign],
    queryFn: () => electionsApi.listByCampaign(campaign),
  });

  const [ref] = useEmblaCarousel({ loop: true, direction: "rtl" });
  const items: Election[] = data ?? [];

  if (!items.length) {
    return null;
  }

  return (
    <div className="mt-4" ref={ref}>
      <div className="flex gap-3">
        {items.map((election) => (
          <button
            key={election.id}
            onClick={() => navigate(`/c/${campaign}/e/${election.id}/dashboard`)}
            className="px-3 py-2 rounded border bg-white dark:bg-zinc-900 text-sm"
          >
            <span className="font-medium">{election.name}</span>
            <span className="ml-2 text-xs opacity-60">{election.phase}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
