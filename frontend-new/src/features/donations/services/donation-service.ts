import { apiClient, ApiResponse } from "@/shared/api/config";
import { DonationDTO, DonationTotalsDTO } from "@/shared/api/dtos";

export type DonationMethod = DonationDTO["method"];

export type Donation = {
  id: string;
  donorName: string;
  amount: number;
  method: DonationMethod;
  date: string;
  notes?: string;
};

export type CreateDonationInput = Omit<Donation, "id">;

type DonationListResponse = ApiResponse<DonationDTO[]>;
type DonationResponse = ApiResponse<DonationDTO>;
type DonationTotalsResponse = ApiResponse<DonationTotalsDTO>;

const mapDonation = (dto: DonationDTO): Donation => ({
  id: String(dto.id),
  donorName: dto.donor_name,
  amount: dto.amount,
  method: dto.method,
  date: dto.donated_at,
  notes: dto.notes ?? undefined,
});

const serializeDonation = (input: CreateDonationInput) => ({
  donor_name: input.donorName,
  amount: input.amount,
  method: input.method,
  donated_at: input.date,
  notes: input.notes,
});

export const donationService = {
  async list() {
    const { data } = await apiClient.get<DonationListResponse>("/donations");
    return (data.data ?? []).map(mapDonation);
  },
  async create(input: CreateDonationInput) {
    const { data } = await apiClient.post<DonationResponse>(
      "/donations",
      serializeDonation(input),
    );

    return data.data ? mapDonation(data.data) : undefined;
  },
  async totals() {
    const { data } = await apiClient.get<DonationTotalsResponse>("/donations/summary");
    return data.data ?? { total: 0, average: 0, count: 0 };
  },
};
