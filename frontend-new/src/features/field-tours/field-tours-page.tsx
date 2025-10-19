import { motion } from "framer-motion";
import { TourCreator } from "./components/tour-creator";
import { TourMap } from "./components/tour-map";
import { TourProgress } from "./components/tour-progress";
import { useFieldTours } from "./hooks/use-field-tours";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const FieldToursPage = () => {
  const { tours, loading, error, addTour, updateStatus } = useFieldTours();

  return (
    <motion.div {...pageMotion} transition={{ duration: 0.3 }} className="space-y-6">
      <section className="rounded-3xl bg-primary/10 p-6 text-primary shadow">
        <h1 className="text-3xl font-bold">Field Tour Planner</h1>
        <p className="mt-1 text-sm opacity-80">Map, staff, and track every canvass deployment.</p>
      </section>

      {error && (
        <p className="rounded-3xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <TourProgress tours={tours} onStatusChange={updateStatus} />
          {loading && (
            <p className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-600 dark:bg-slate-800/40 dark:text-slate-300">
              Loading tours…
            </p>
          )}
        </div>
        <div className="space-y-6">
          <TourCreator onCreate={addTour} />
          <TourMap tours={tours} />
        </div>
      </div>
    </motion.div>
  );
};
