import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/shared/ui";
import { CreateDonationInput, DonationMethod } from "../services/donation-service";

const methodOptions: { label: string; value: DonationMethod }[] = [
  { label: "Cash", value: "cash" },
  { label: "Credit card", value: "card" },
  { label: "Check", value: "check" },
  { label: "Online", value: "online" },
];

type DonationFormProps = {
  onSubmit: (input: CreateDonationInput) => Promise<void> | void;
};

const createInitialForm = (): CreateDonationInput => ({
  donorName: "",
  amount: 25,
  method: "online",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
});

export const DonationForm = ({ onSubmit }: DonationFormProps) => {
  const [formState, setFormState] = useState<CreateDonationInput>(createInitialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof CreateDonationInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = field === "amount" ? Number(event.target.value) : event.target.value;
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formState,
        notes: formState.notes?.trim() ? formState.notes : undefined,
      });
      setFormState(createInitialForm());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Record donation</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Log offline gifts to keep totals accurate.</p>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Donor name
          <input
            required
            value={formState.donorName}
            onChange={handleChange("donorName")}
            placeholder="Supporter name"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Amount
            <input
              type="number"
              min={1}
              value={formState.amount}
              onChange={handleChange("amount")}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Method
            <select
              value={formState.method}
              onChange={handleChange("method")}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {methodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Date received
          <input
            type="date"
            value={formState.date}
            onChange={handleChange("date")}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Notes
          <textarea
            value={formState.notes ?? ""}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setFormState((prev) => ({
                ...prev,
                notes: event.target.value,
              }))
            }
            rows={3}
            placeholder="Receipt info, compliance notes, premium items…"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <Button type="submit" className="rounded-2xl text-base" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save donation"}
        </Button>
      </form>
    </section>
  );
};
