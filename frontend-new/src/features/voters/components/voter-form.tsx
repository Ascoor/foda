import { ChangeEvent, FormEvent, useState } from "react";
import { CreateVoterInput, VoterStatus } from "../services/voter-service";
import { Button } from "@/shared/ui";

const statuses: { label: string; value: VoterStatus }[] = [
  { label: "Supporter", value: "supporter" },
  { label: "Leaning", value: "leaning" },
  { label: "Undecided", value: "undecided" },
  { label: "Opposed", value: "opposed" },
  { label: "Unknown", value: "unknown" },
];

type VoterFormProps = {
  precinctOptions?: string[];
  onSubmit: (input: CreateVoterInput) => Promise<void> | void;
};

type FormState = {
  fullName: string;
  precinct: string;
  address: string;
  phone: string;
  email: string;
  preferredContact: CreateVoterInput["preferredContact"];
  status: VoterStatus;
  likelihoodScore: number;
  notes: string;
};

const initialState: FormState = {
  fullName: "",
  precinct: "",
  address: "",
  phone: "",
  email: "",
  preferredContact: "phone",
  status: "unknown",
  likelihoodScore: 50,
  notes: "",
};

export const VoterForm = ({ precinctOptions = [], onSubmit }: VoterFormProps) => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = field === "likelihoodScore" ? Number(event.target.value) : event.target.value;
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => setFormState(initialState);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formState,
        likelihoodScore: Number(formState.likelihoodScore),
        phone: formState.phone || undefined,
        email: formState.email || undefined,
        notes: formState.notes || undefined,
      });
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Add Voter</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Capture supporters, undecided voters, and more.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 md:col-span-2">
          Full name
          <input
            required
            value={formState.fullName}
            onChange={handleChange("fullName")}
            placeholder="Sarah Connor"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Precinct
          <input
            list="precinct-options"
            value={formState.precinct}
            onChange={handleChange("precinct")}
            placeholder="Downtown"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {precinctOptions.length > 0 && (
            <datalist id="precinct-options">
              {precinctOptions.map((precinct) => (
                <option key={precinct} value={precinct} />
              ))}
            </datalist>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Address
          <input
            value={formState.address}
            onChange={handleChange("address")}
            placeholder="123 Main St"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Phone number
          <input
            value={formState.phone}
            onChange={handleChange("phone")}
            placeholder="555-123-4567"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Email address
          <input
            value={formState.email}
            onChange={handleChange("email")}
            placeholder="sarah@example.com"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Preferred contact
          <select
            value={formState.preferredContact}
            onChange={handleChange("preferredContact")}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="phone">Phone</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="in-person">In-person</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Status
          <select
            value={formState.status}
            onChange={handleChange("status")}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Support score
          <input
            type="range"
            min={0}
            max={100}
            value={formState.likelihoodScore}
            onChange={handleChange("likelihoodScore")}
            className="accent-primary"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formState.likelihoodScore} / 100
          </span>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 md:col-span-2">
          Notes
          <textarea
            value={formState.notes}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setFormState((prev) => ({
                ...prev,
                notes: event.target.value,
              }))
            }
            rows={3}
            placeholder="Key issues, volunteer commitments, accessibility needs..."
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <div className="md:col-span-2">
          <Button type="submit" className="w-full rounded-2xl text-base" disabled={isSubmitting}>
            {isSubmitting ? "Adding voter..." : "Add voter"}
          </Button>
        </div>
      </form>
    </section>
  );
};
