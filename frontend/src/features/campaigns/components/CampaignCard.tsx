import { memo } from "react";
import { motion } from "framer-motion";
import { CalendarRange, MapPin, Users } from "lucide-react";

import type { Campaign } from "@/types";
import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";

interface CampaignCardProps {
  campaign: Campaign;
  isActive?: boolean;
  onSelect?: (campaign: Campaign) => void;
  locale?: "ar" | "en";
}

const CampaignCardComponent = ({
  campaign,
  isActive = false,
  onSelect,
  locale = "en",
}: CampaignCardProps) => {
  const startsAt = campaign.starts_at
    ? new Date(campaign.starts_at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")
    : null;
  const endsAt = campaign.ends_at
    ? new Date(campaign.ends_at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")
    : null;

  return (
    <motion.article
      layout
      data-active={isActive}
      className={cn(
        "glass-card relative flex h-full flex-col justify-between rounded-3xl border border-transparent bg-gradient-to-br from-background/60 via-background/70 to-background/40 p-6 shadow-lg transition-all duration-300",
        isActive
          ? "border-primary/60 shadow-primary/30"
          : "hover:border-primary/30 hover:shadow-primary/20",
      )}
      whileHover={{ translateY: -4 }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-foreground sm:text-xl">
              {campaign.name}
            </h3>
            {campaign.description ? (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {campaign.description}
              </p>
            ) : null}
          </div>
          <span
            className={cn(
              "inline-flex min-w-[88px] items-center justify-center rounded-full px-3 py-1 text-xs font-medium",
              isActive
                ? "bg-primary/15 text-primary"
                : "bg-muted/60 text-muted-foreground",
            )}
          >
            {campaign.status ?? "draft"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-primary" />
            <span>
              {startsAt && endsAt
                ? `${startsAt} – ${endsAt}`
                : startsAt || endsAt || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{campaign.default_geo_scope ?? ""}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>
              {(campaign.goals?.[0]?.target_value ?? 0).toLocaleString(
                locale === "ar" ? "ar-EG" : "en-GB",
              )}{" "}
              {locale === "ar" ? "مستهدف" : "target"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground">
          {campaign.created_at
            ? new Date(campaign.created_at).toLocaleDateString(
                locale === "ar" ? "ar-EG" : "en-GB",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
              )
            : null}
        </div>
        <Button
          size="sm"
          className="rounded-full bg-gradient-primary px-5 text-sm font-medium text-white shadow-md"
          onClick={() => onSelect?.(campaign)}
        >
          {locale === "ar" ? "فتح" : "Open"}
        </Button>
      </div>
    </motion.article>
  );
};

export const CampaignCard = memo(CampaignCardComponent);
