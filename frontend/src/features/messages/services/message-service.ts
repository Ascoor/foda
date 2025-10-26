import { apiClient, ApiResponse } from "@/shared/api/config";
import { CampaignMessageDTO, CampaignMessageInputDTO } from "@/shared/api/dtos";

export type MessageChannel = CampaignMessageDTO["channel"];

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
  segment?: string;
};

type MessageListResponse = ApiResponse<CampaignMessageDTO[]>;
type MessageResponse = ApiResponse<CampaignMessageDTO>;

const mapMessage = (dto: CampaignMessageDTO): CampaignMessage => ({
  id: String(dto.id),
  channel: dto.channel,
  recipient: dto.recipient,
  body: dto.body,
  sentAt: dto.sent_at,
});

const serializeDraft = (draft: DraftMessage): CampaignMessageInputDTO => ({
  channel: draft.channel,
  recipient: draft.recipient,
  body: draft.body,
  segment: draft.segment,
});

export const messageService = {
  async list() {
    const { data } = await apiClient.get<MessageListResponse>("/messages");
    return (data.data ?? []).map(mapMessage);
  },
  async send(message: DraftMessage) {
    const { data } = await apiClient.post<MessageResponse>(
      "/messages/send",
      serializeDraft(message),
    );

    return data.data ? mapMessage(data.data) : undefined;
  },
};
