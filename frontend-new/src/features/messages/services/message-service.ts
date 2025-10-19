export type MessageChannel = "sms" | "email";

export type CampaignMessage = {
  id: string;
  channel: MessageChannel;
  recipient: string;
  body: string;
  sentAt: string;
};

export type DraftMessage = {
  channel: MessageChannel;
  recipient: string;
  body: string;
};

const createId = () => Math.random().toString(36).slice(2, 9);

let history: CampaignMessage[] = [
  {
    id: createId(),
    channel: "sms",
    recipient: "+1 (555) 123-9981",
    body: "Hi Layla! Early voting starts Monday. Need help getting there?",
    sentAt: "2024-08-16T14:32:00Z",
  },
  {
    id: createId(),
    channel: "email",
    recipient: "organizers@north-ridge.org",
    body: "Canvass launch this weekend — confirm your shift in Mobilize",
    sentAt: "2024-08-15T09:12:00Z",
  },
];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const messageService = {
  async list() {
    return clone(history);
  },
  async send(message: DraftMessage) {
    const record: CampaignMessage = {
      ...message,
      id: createId(),
      sentAt: new Date().toISOString(),
    };

    history = [record, ...history];
    return clone(record);
  },
};
