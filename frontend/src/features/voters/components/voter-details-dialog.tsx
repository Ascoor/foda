import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Voter, VoterInteractionInput } from "../services/voter-service";
import { Button } from "@/shared/ui";

type VoterDetailsDialogProps = {
  open: boolean;
  voter: Voter | null;
  onClose: () => void;
  onLogInteraction: (interaction: VoterInteractionInput) => Promise<void> | void;
};

const interactionChannels: VoterInteractionInput["channel"][] = ["call", "door", "sms", "email"];

export const VoterDetailsDialog = ({ open, voter, onClose, onLogInteraction }: VoterDetailsDialogProps) => {
  const [formState, setFormState] = useState<VoterInteractionInput>({
    channel: "call",
    outcome: "noted",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interactionHistory = useMemo(() => voter?.interactions ?? [], [voter?.interactions]);

  if (!open || !voter) return null;

  const handleChange = (field: keyof VoterInteractionInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onLogInteraction({
        ...formState,
        notes: formState.notes?.trim() ? formState.notes : undefined,
      });
      setFormState({ channel: "call", outcome: "noted", notes: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{voter.fullName}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{voter.address ?? "Address unavailable"}</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="rounded-2xl px-3 py-2">
            Close
          </Button>
        </header>

        <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Contact preferences
              </h4>
              <dl className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-slate-200">
                <div className="flex justify-between">
                  <dt className="font-medium">Precinct</dt>
                  <dd>{voter.precinct}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Preferred channel</dt>
                  <dd className="capitalize">{voter.preferredContact.replace("-", " ")}</dd>
                </div>
                {voter.phone && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Phone</dt>
                    <dd>{voter.phone}</dd>
                  </div>
                )}
                {voter.email && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Email</dt>
                    <dd>{voter.email}</dd>
                  </div>
                )}
                {voter.notes && (
                  <div>
                    <dt className="font-medium">Notes</dt>
                    <dd className="text-xs text-slate-500 dark:text-slate-400">{voter.notes}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Log interaction
              </h4>
              <form onSubmit={handleSubmit} className="grid gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Channel
                  <select
                    value={formState.channel}
                    onChange={handleChange("channel")}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {interactionChannels.map((channel) => (
                      <option key={channel} value={channel}>
                        {channel.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Outcome
                  <input
                    required
                    value={formState.outcome}
                    onChange={handleChange("outcome")}
                    placeholder="confirmed, follow-up, voicemail…"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </label>

                <label className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Notes
                  <textarea
                    value={formState.notes ?? ""}
                    onChange={handleChange("notes")}
                    rows={3}
                    placeholder="Key details from the conversation"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </label>

                <Button type="submit" disabled={isSubmitting} className="rounded-xl text-sm">
                  {isSubmitting ? "Saving…" : "Log interaction"}
                </Button>
              </form>
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Interaction history
            </h4>
            <div className="space-y-4 overflow-y-auto rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              {interactionHistory.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No interactions have been recorded yet.</p>
              ) : (
                interactionHistory.map((interaction) => (
                  <article key={interaction.id} className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
                    <header className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <span>{interaction.channel.toUpperCase()}</span>
                      <span>{interaction.date}</span>
                    </header>
                    <p className="mt-2 font-semibold text-slate-700 dark:text-slate-100">{interaction.outcome}</p>
                    {interaction.notes && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{interaction.notes}</p>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
