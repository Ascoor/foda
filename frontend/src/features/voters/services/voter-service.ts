import { apiClient, ApiResponse } from "@/shared/api/config";
import { VoterDTO, VoterInteractionDTO } from "@/shared/api/dtos";

export type VoterStatus =
  | "supporter"
  | "leaning"
  | "undecided"
  | "opposed"
  | "unknown";

export type VoterInteraction = {
  id: string;
  date: string;
  channel: VoterInteractionDTO["channel"];
  outcome: string;
  notes?: string;
};

export type Voter = {
  id: string;
  fullName: string;
  precinct: string;
  address: string;
  phone?: string;
  email?: string;
  preferredContact: VoterDTO["preferred_contact"];
  status: VoterStatus;
  likelihoodScore: number;
  lastContacted?: string;
  notes?: string;
  interactions: VoterInteraction[];
};

export type CreateVoterInput = Omit<Voter, "id" | "interactions"> & {
  interactions?: VoterInteraction[];
};

export type VoterFilters = {
  search?: string;
  status?: VoterStatus | "all";
  precinct?: string;
  minScore?: number;
};

export type VoterInteractionInput = Omit<VoterInteraction, "id" | "date"> & {
  date?: string;
};

type VoterListResponse = ApiResponse<VoterDTO[]>;
type VoterResponse = ApiResponse<VoterDTO>;

type InteractionResponse = ApiResponse<VoterInteractionDTO>;

const toInteraction = (dto: VoterInteractionDTO): VoterInteraction => ({
  id: String(dto.id),
  channel: dto.channel,
  outcome: dto.outcome,
  notes: dto.notes ?? undefined,
  date: dto.occurred_at,
});

const toVoter = (dto: VoterDTO): Voter => ({
  id: String(dto.id),
  fullName: `${dto.first_name} ${dto.last_name}`.trim(),
  precinct: dto.precinct,
  address: dto.address ?? "",
  phone: dto.phone,
  email: dto.email,
  preferredContact: dto.preferred_contact,
  status: dto.status,
  likelihoodScore: dto.likelihood_score,
  lastContacted: dto.last_contacted ?? undefined,
  notes: dto.notes ?? undefined,
  interactions: (dto.interactions ?? []).map(toInteraction),
});

const fromInteractionInput = (input: VoterInteractionInput) => ({
  channel: input.channel,
  outcome: input.outcome,
  notes: input.notes,
  occurred_at: input.date ?? new Date().toISOString(),
});

const fromCreateInput = (input: CreateVoterInput) => ({
  first_name: input.fullName.split(" ")[0] ?? input.fullName,
  last_name: input.fullName.split(" ").slice(1).join(" "),
  precinct: input.precinct,
  address: input.address,
  phone: input.phone,
  email: input.email,
  preferred_contact: input.preferredContact,
  status: input.status,
  likelihood_score: input.likelihoodScore,
  notes: input.notes,
  interactions: input.interactions?.map((interaction) => ({
    channel: interaction.channel,
    outcome: interaction.outcome,
    notes: interaction.notes,
    occurred_at: interaction.date ?? new Date().toISOString(),
  })),
});

export const voterService = {
  async getVoters(filters?: VoterFilters) {
    const { data } = await apiClient.get<VoterListResponse>("/voters", {
      params: {
        search: filters?.search,
        status: filters?.status === "all" ? undefined : filters?.status,
        precinct: filters?.precinct,
        min_score: filters?.minScore,
      },
    });

    return (data.data ?? []).map(toVoter);
  },
  async createVoter(input: CreateVoterInput) {
    const { data } = await apiClient.post<VoterResponse>("/voters", fromCreateInput(input));
    return data.data ? toVoter(data.data) : undefined;
  },
  async updateVoterStatus(id: string, status: VoterStatus) {
    const { data } = await apiClient.patch<VoterResponse>(`/voters/${id}`, {
      status,
    });

    return data.data ? toVoter(data.data) : undefined;
  },
  async logInteraction(id: string, interactionInput: VoterInteractionInput) {
    const { data } = await apiClient.post<InteractionResponse>(
      `/voters/${id}/interactions`,
      fromInteractionInput(interactionInput),
    );

    return data.data ? toInteraction(data.data) : undefined;
  },
};
