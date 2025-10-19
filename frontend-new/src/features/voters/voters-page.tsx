import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { VoterDetailsDialog } from "./components/voter-details-dialog";
import { VoterFilters } from "./components/voter-filters";
import { VoterForm } from "./components/voter-form";
import { VoterTable } from "./components/voter-table";
import { useVoters } from "./hooks/use-voters";
import { VoterInteractionInput } from "./services/voter-service";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const VotersPage = () => {
  const {
    voters,
    filteredVoters,
    filters,
    statusCounts,
    totalVoters,
    loading,
    error,
    precincts,
    addVoter,
    updateFilters,
    updateStatus,
    logInteraction,
  } = useVoters();

  const [selectedVoterId, setSelectedVoterId] = useState<string | null>(null);
  const selectedVoter = useMemo(
    () => voters.find((voter) => voter.id === selectedVoterId) ?? null,
    [selectedVoterId, voters],
  );

  const handleLogInteraction = async (interaction: VoterInteractionInput) => {
    if (!selectedVoterId) return;
    await logInteraction(selectedVoterId, interaction);
  };

  return (
    <motion.div {...pageMotion} transition={{ duration: 0.3 }} className="space-y-6">
      <section className="rounded-3xl bg-primary/10 p-6 text-primary shadow">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Voter Data Hub</h1>
            <p className="text-sm opacity-80">
              Track supporters, undecideds, and GOTV priorities in real-time.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-4 text-sm font-semibold text-primary">
            <div>
              <dt className="uppercase tracking-wide text-xs opacity-70">Universe</dt>
              <dd className="text-2xl">{totalVoters}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-wide text-xs opacity-70">Strong supporters</dt>
              <dd className="text-2xl">{statusCounts.supporter}</dd>
            </div>
          </dl>
        </div>
      </section>

      <VoterForm precinctOptions={precincts} onSubmit={addVoter} />
      <VoterFilters filters={filters} precinctOptions={precincts} onFiltersChange={updateFilters} />

      {error && <p className="rounded-3xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}

      <VoterTable
        voters={filteredVoters}
        isLoading={loading}
        onSelectVoter={setSelectedVoterId}
        onUpdateStatus={updateStatus}
      />

      <VoterDetailsDialog
        open={Boolean(selectedVoter)}
        voter={selectedVoter}
        onClose={() => setSelectedVoterId(null)}
        onLogInteraction={handleLogInteraction}
      />
    </motion.div>
  );
};
