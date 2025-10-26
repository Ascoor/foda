import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/shared/ui";
import { CreateFieldTourInput } from "../services/field-tour-service";

const createInitialForm = (): CreateFieldTourInput => ({
  name: "",
  neighborhood: "",
  date: new Date().toISOString().slice(0, 10),
  canvassersNeeded: 4,
  assignedVolunteers: [],
});

type TourCreatorProps = {
  onCreate: (input: CreateFieldTourInput) => Promise<void> | void;
};

export const TourCreator = ({ onCreate }: TourCreatorProps) => {
  const [formState, setFormState] = useState<CreateFieldTourInput>(createInitialForm);
  const [volunteerName, setVolunteerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof CreateFieldTourInput) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = field === "canvassersNeeded" ? Number(event.target.value) : event.target.value;
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const addVolunteer = () => {
    if (!volunteerName.trim()) return;
    setFormState((prev) => ({
      ...prev,
      assignedVolunteers: [...prev.assignedVolunteers, volunteerName.trim()],
    }));
    setVolunteerName("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onCreate(formState);
      setFormState(createInitialForm());
      setVolunteerName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create tour</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Plan the route, crew, and day-of logistics.</p>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Tour name
          <input
            required
            value={formState.name}
            onChange={handleChange("name")}
            placeholder="Sunset Hills Blitz"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Neighborhood
            <input
              required
              value={formState.neighborhood}
              onChange={handleChange("neighborhood")}
              placeholder="Downtown"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Date
            <input
              type="date"
              value={formState.date}
              onChange={handleChange("date")}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Canvassers needed
          <input
            type="number"
            min={1}
            value={formState.canvassersNeeded}
            onChange={handleChange("canvassersNeeded")}
            className="w-24 rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <div className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Assign volunteers
          <div className="flex items-center gap-2">
            <input
              value={volunteerName}
              onChange={(event) => setVolunteerName(event.target.value)}
              placeholder="Volunteer name"
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <Button type="button" size="sm" variant="outline" className="rounded-xl" onClick={addVolunteer}>
              Add
            </Button>
          </div>
          {formState.assignedVolunteers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formState.assignedVolunteers.map((volunteer) => (
                <span key={volunteer} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {volunteer}
                </span>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="rounded-2xl text-base">
          {isSubmitting ? "Scheduling…" : "Schedule tour"}
        </Button>
      </form>
    </section>
  );
};
