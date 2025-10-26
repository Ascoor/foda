import { ChangeEvent, FormEvent } from "react";
import { Button } from "@/shared/ui";
import { DraftMessage, MessageChannel } from "../services/message-service";

const channelOptions: { label: string; value: MessageChannel }[] = [
  { label: "SMS", value: "sms" },
  { label: "Email", value: "email" },
];

type MessageFormProps = {
  draft: DraftMessage;
  sending: boolean;
  onChange: <K extends keyof DraftMessage>(field: K, value: DraftMessage[K]) => void;
  onSubmit: () => Promise<void> | void;
};

export const MessageForm = ({ draft, sending, onChange, onSubmit }: MessageFormProps) => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => onChange("channel", event.target.value as MessageChannel);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Send broadcast</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Deliver a quick SMS or email to your campaign universe.</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Channel
            <select
              value={draft.channel}
              onChange={handleSelect}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {channelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Recipient
            <input
              required
              value={draft.recipient}
              onChange={(event) => onChange("recipient", event.target.value)}
              placeholder="Voter phone or email"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Message
          <textarea
            required
            value={draft.body}
            onChange={(event) => onChange("body", event.target.value)}
            rows={4}
            placeholder="Type your message…"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <Button type="submit" disabled={sending} className="rounded-2xl text-base">
          {sending ? "Sending…" : "Send message"}
        </Button>
      </form>
    </section>
  );
};
