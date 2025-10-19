import { CampaignConfig } from "../services/settings-service";

type CampaignConfigProps = {
  config: CampaignConfig | null;
};

export const CampaignConfigPanel = ({ config }: CampaignConfigProps) => (
  <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Campaign configuration</h2>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Core settings for team communication.</p>

    {config ? (
      <dl className="mt-4 grid gap-3 text-sm text-slate-700 dark:text-slate-200">
        <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/40">
          <dt className="font-medium">Election day</dt>
          <dd>{config.electionDate}</dd>
        </div>
        <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/40">
          <dt className="font-medium">Headquarters</dt>
          <dd>{config.headquarters}</dd>
        </div>
        <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/40">
          <dt className="font-medium">Default language</dt>
          <dd>{config.defaultLanguage}</dd>
        </div>
        <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/40">
          <dt className="font-medium">Contact email</dt>
          <dd>{config.contactEmail}</dd>
        </div>
      </dl>
    ) : (
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading configuration…</p>
    )}
  </section>
);
