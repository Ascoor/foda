import { Header } from "@/shared/ui";
import { VolunteerForm } from "./components/volunteer-form";
import { VolunteerList } from "./components/volunteer-list";
import { VolunteerStats } from "./components/volunteer-stats";
import { TaskAssignment } from "./components/task-assignment";
import { useVolunteers } from "./hooks/use-volunteers";

export const Volunteers = () => {
  const { volunteers, stats, loading, error, addVolunteer, updateStatus } = useVolunteers();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-slate-100 pb-20 dark:from-background-dark dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
        <section className="rounded-3xl bg-primary/10 p-6 text-primary shadow">
          <h1 className="text-3xl font-bold">Volunteer Operations</h1>
          <p className="mt-1 text-sm opacity-80">Recruit, onboard, and track volunteers powering the campaign.</p>
        </section>

        <VolunteerStats stats={stats} />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <VolunteerList volunteers={volunteers} isLoading={loading} onUpdateStatus={updateStatus} />
          <div className="space-y-6">
            <VolunteerForm onSubmit={addVolunteer} />
            <TaskAssignment volunteers={volunteers} />
          </div>
        </div>

        {error && <p className="rounded-3xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}
      </main>
    </div>
  );
};
