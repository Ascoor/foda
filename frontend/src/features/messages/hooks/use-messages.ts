import { useCallback, useEffect, useState } from "react";
import { CampaignMessage, DraftMessage, MessageChannel, messageService } from "../services/message-service";

const defaultDraft: DraftMessage = {
  channel: "sms",
  recipient: "",
  body: "",
};

export const useMessages = () => {
  const [draft, setDraft] = useState<DraftMessage>(defaultDraft);
  const [history, setHistory] = useState<CampaignMessage[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      const pastMessages = await messageService.list();
      setHistory(pastMessages);
    };

    load();
  }, []);

  const updateDraft = useCallback(<K extends keyof DraftMessage>(field: K, value: DraftMessage[K]) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const resetDraft = useCallback(() => setDraft(defaultDraft), []);

  const sendMessage = useCallback(async () => {
    setSending(true);
    try {
      const record = await messageService.send(draft);
      setHistory((prev) => [record, ...prev]);
      resetDraft();
    } finally {
      setSending(false);
    }
  }, [draft, resetDraft]);

  const filterByChannel = useCallback(
    (channel: MessageChannel | "all") => {
      if (channel === "all") return history;
      return history.filter((message) => message.channel === channel);
    },
    [history],
  );

  return {
    draft,
    history,
    sending,
    updateDraft,
    resetDraft,
    sendMessage,
    filterByChannel,
  };
};
