import useEmblaCarousel from "embla-carousel-react";
import type { Campaign } from "../../../shared/api/campaigns.service";
import CampaignCard from "./CampaignCard";

type Props = {
  items: Campaign[];
  onOpen: (id: number) => void;
};

export default function CampaignsCarousel({ items, onOpen }: Props) {
  const [ref] = useEmblaCarousel({ loop: true, direction: "rtl" });

  return (
    <div className="embla" ref={ref}>
      <div className="embla__container flex gap-4">
        {items.map((c) => (
          <div key={c.id} className="embla__slide min-w-[260px] max-w-[260px]">
            <CampaignCard c={c} onOpen={() => onOpen(c.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
