import { Volunteer } from "../services/volunteer-service";

const taskTemplates = [
  {
    name: "Neighborhood Canvass",
    description: "Door knocking shift with turf map and scripts",
    duration: "2h",
  },
  {
    name: "Phone Bank",
    description: "Virtual shift to confirm supporter turnout",
    duration: "1.5h",
  },
  {
    name: "Community Event",
    description: "Tabling or visibility at key locations",
    duration: "3h",
  },
];

type TaskAssignmentProps = {
  volunteers: Volunteer[];
};

export const TaskAssignment = ({ volunteers }: TaskAssignmentProps) => {
  const availableVolunteers = volunteers.filter((volunteer) => volunteer.status !== "inactive");

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Upcoming shifts</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Match trained volunteers with field needs.</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {availableVolunteers.length} ready
        </span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {taskTemplates.map((task) => (
          <article key={task.name} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{task.name}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">{task.duration}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Suggested: {availableVolunteers.slice(0, 3).map((volunteer) => volunteer.fullName).join(", ") || "Assign soon"}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};
