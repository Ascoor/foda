import { useEffect, useState } from "react";

import { useCampaignStore } from "@/shared/state/campaignStore";

type CampaignOption = {
  id: string;
  name: string;
};

type CampaignSwitcherProps = {
  campaigns: CampaignOption[];
  placeholder?: string;
};

export default function CampaignSwitcher({
  campaigns,
  placeholder = "اختر حملة",
}: CampaignSwitcherProps) {
  const { campaignId, setCampaignId } = useCampaignStore();
  const [selected, setSelected] = useState(campaignId ?? "");

  useEffect(() => {
    setSelected(campaignId ?? "");
  }, [campaignId]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value || null;
    setSelected(value ?? "");
    setCampaignId(value);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span>الحملة:</span>
      <select
        className="min-w-[200px] rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-slate-700 dark:bg-slate-900"
        value={selected}
        onChange={handleChange}
      >
        <option value="">{placeholder}</option>
        {campaigns.map((campaign) => (
          <option key={campaign.id} value={campaign.id}>
            {campaign.name}
          </option>
        ))}
      </select>
    </div>
  );
}
