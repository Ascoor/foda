import { motion } from "framer-motion";
import type { Campaign } from "../../../shared/api/campaigns.service";

type Props = {
  c: Campaign;
  onOpen: () => void;
};

export default function CampaignCard({ c, onOpen }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden shadow border bg-white dark:bg-zinc-900"
    >
      <div
        className="h-32 bg-gray-200"
        style={{
          backgroundImage: c.coverUrl ? `url(${c.coverUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="p-3">
        <div className="font-semibold">{c.name}</div>
        <div className="text-xs opacity-60 capitalize">{c.status}</div>
        <button onClick={onOpen} className="mt-2 text-sm px-3 py-1 rounded bg-black text-white">
          Open
        </button>
      </div>
    </motion.div>
  );
}
