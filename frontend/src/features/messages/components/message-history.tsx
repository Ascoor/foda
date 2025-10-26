import { CampaignMessage, MessageChannel } from "../services/message-service";

const channelStyles: Record<MessageChannel, string> = {
  sms: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
  email: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200",
};

type MessageHistoryProps = {
  history: CampaignMessage[];
};

export const MessageHistory = ({ history }: MessageHistoryProps) => (
  <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">History</h2>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {history.length} sent
      </span>
    </div>

    <div className="mt-4 space-y-4">
      {history.map((message) => (
        <article key={message.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${channelStyles[message.channel]}`}>
              {message.channel}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(message.sentAt).toLocaleString()}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">To: {message.recipient}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message.body}</p>
        </article>
      ))}

      {history.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No messages yet. Send your first update using the form.
        </p>
      )}
    </div>
  </section>
);
