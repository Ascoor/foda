const scheduledCampaigns = [
  {
    id: "weekend-reminder",
    title: "Weekend canvass reminder",
    channel: "sms",
    sendAt: "2024-08-23T17:00:00Z",
  },
  {
    id: "fundraiser",
    title: "Fundraiser RSVP follow-up",
    channel: "email",
    sendAt: "2024-08-22T09:00:00Z",
  },
];

export const MessageScheduler = () => (
  <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Scheduled campaigns</h2>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Automate reminders and follow-ups with your team.</p>

    <div className="mt-4 space-y-3">
      {scheduledCampaigns.map((campaign) => (
        <article key={campaign.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{campaign.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{campaign.channel.toUpperCase()} • {new Date(campaign.sendAt).toLocaleString()}</p>
        </article>
      ))}

      {scheduledCampaigns.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No scheduled messages. Plan one to keep supporters engaged.
        </p>
      )}
    </div>
  </section>
);
