import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/shared/ui";
import { CreateVolunteerInput, VolunteerStatus } from "../services/volunteer-service";

const createInitialForm = (): CreateVolunteerInput => ({
  fullName: "",
  phone: "",
  email: "",
  neighborhood: "",
  status: "training",
  skills: [],
  availability: "",
  hoursThisWeek: 0,
  assignedTasks: [],
});

const statusOptions: VolunteerStatus[] = ["active", "training", "inactive"];

type VolunteerFormProps = {
  onSubmit: (input: CreateVolunteerInput) => Promise<void> | void;
};

export const VolunteerForm = ({ onSubmit }: VolunteerFormProps) => {
  const [formState, setFormState] = useState<CreateVolunteerInput>(createInitialForm);
  const [newSkill, setNewSkill] = useState("");
  const [newTask, setNewTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof CreateVolunteerInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setFormState((prev) => ({
        ...prev,
        [field]: field === "hoursThisWeek" ? Number(value) : value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: CreateVolunteerInput = {
        ...formState,
        phone: formState.phone || undefined,
        email: formState.email || undefined,
        skills: formState.skills.length ? formState.skills : newSkill ? [newSkill] : [],
        assignedTasks: formState.assignedTasks.length ? formState.assignedTasks : newTask ? [newTask] : [],
      };

      await onSubmit(payload);
      setFormState(createInitialForm());
      setNewSkill("");
      setNewTask("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const appendSkill = () => {
    if (!newSkill.trim()) return;
    setFormState((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()],
    }));
    setNewSkill("");
  };

  const appendTask = () => {
    if (!newTask.trim()) return;
    setFormState((prev) => ({
      ...prev,
      assignedTasks: [...prev.assignedTasks, newTask.trim()],
    }));
    setNewTask("");
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Add a volunteer</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Collect contact details, skills, and onboarding status.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 md:col-span-2">
          Full name
          <input
            required
            value={formState.fullName}
            onChange={handleChange("fullName")}
            placeholder="Layla Hussein"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Phone
          <input
            value={formState.phone ?? ""}
            onChange={handleChange("phone")}
            placeholder="555-123-4567"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Email
          <input
            value={formState.email ?? ""}
            onChange={handleChange("email")}
            placeholder="layla@example.com"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

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
          Status
          <select
            value={formState.status}
            onChange={handleChange("status")}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Availability
          <input
            value={formState.availability}
            onChange={handleChange("availability")}
            placeholder="Weekdays 5-8pm"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Hours this week
          <input
            type="number"
            min={0}
            value={formState.hoursThisWeek}
            onChange={handleChange("hoursThisWeek")}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <div className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Skills
          <div className="flex items-center gap-2">
            <input
              value={newSkill}
              onChange={(event) => setNewSkill(event.target.value)}
              placeholder="Phone banking"
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <Button type="button" size="sm" variant="outline" className="rounded-xl" onClick={appendSkill}>
              Add
            </Button>
          </div>
          {formState.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formState.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Tasks
          <div className="flex items-center gap-2">
            <input
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="Canvassing shift"
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <Button type="button" size="sm" variant="outline" className="rounded-xl" onClick={appendTask}>
              Add
            </Button>
          </div>
          {formState.assignedTasks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formState.assignedTasks.map((task) => (
                <span key={task} className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {task}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <Button type="submit" className="w-full rounded-2xl text-base" disabled={isSubmitting}>
            {isSubmitting ? "Saving volunteer…" : "Save volunteer"}
          </Button>
        </div>
      </form>
    </section>
  );
};
