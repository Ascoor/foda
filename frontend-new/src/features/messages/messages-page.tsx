import { MessageForm } from "./components/message-form";
import { MessageHistory } from "./components/message-history";
import { MessageScheduler } from "./components/message-scheduler";
import { useMessages } from "./hooks/use-messages";

export const MessagesPage = () => {
  const { draft, history, sending, updateDraft, sendMessage } = useMessages();

  return (
    <div className="space-y-6 bg-gradient-to-br from-background via-white to-slate-100 p-6 dark:from-background-dark dark:via-slate-900 dark:to-slate-950">
      <header className="rounded-3xl bg-primary/10 p-6 text-primary shadow">
        <h1 className="text-3xl font-bold">Communications Center</h1>
        <p className="mt-1 text-sm opacity-80">Keep supporters and volunteers updated with timely outreach.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <MessageForm draft={draft} sending={sending} onChange={updateDraft} onSubmit={sendMessage} />
          <MessageScheduler />
        </div>
        <MessageHistory history={history} />
      </div>
    </div>
  );
};
