import { ChangeEvent } from "react";
import { VoterFilters, VoterStatus } from "../services/voter-service";

const statuses: (VoterStatus | "all")[] = ["all", "supporter", "leaning", "undecided", "opposed", "unknown"];

type VoterFiltersProps = {
  filters: VoterFilters;
  precinctOptions?: string[];
  onFiltersChange: (filters: Partial<VoterFilters>) => void;
};

export const VoterFilters = ({ filters, precinctOptions = [], onFiltersChange }: VoterFiltersProps) => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    onFiltersChange({
      search: event.target.value,
    });

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) =>
    onFiltersChange({
      status: event.target.value as VoterFilters["status"],
    });

  const handlePrecinctChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    onFiltersChange({
      precinct: event.target.value || undefined,
    });

  const handleScoreChange = (event: ChangeEvent<HTMLInputElement>) =>
    onFiltersChange({
      minScore: event.target.value ? Number(event.target.value) : undefined,
    });

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div className="grow">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Search
            <input
              type="search"
              value={filters.search ?? ""}
              onChange={handleSearchChange}
              placeholder="Search by name or precinct"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
        </div>

        <div>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Status
            <select
              value={filters.status ?? "all"}
              onChange={handleStatusChange}
              className="min-w-[160px] rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Precinct
            <input
              list="filter-precincts"
              value={filters.precinct ?? ""}
              onChange={handlePrecinctChange}
              placeholder="All precincts"
              className="min-w-[160px] rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {precinctOptions.length > 0 && (
              <datalist id="filter-precincts">
                {precinctOptions.map((precinct) => (
                  <option key={precinct} value={precinct} />
                ))}
              </datalist>
            )}
          </label>
        </div>

        <div>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Minimum score
            <input
              type="number"
              min={0}
              max={100}
              value={filters.minScore ?? ""}
              onChange={handleScoreChange}
              placeholder="0"
              className="w-28 rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
        </div>
      </div>
    </section>
  );
};
