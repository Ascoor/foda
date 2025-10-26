import { apiClient, ApiResponse } from "@/shared/api/config";
import { FieldTourDTO } from "@/shared/api/dtos";

export type FieldTourStatus = FieldTourDTO["status"];

export type FieldTour = {
  id: string;
  name: string;
  neighborhood: string;
  date: string;
  canvassersNeeded: number;
  assignedVolunteers: string[];
  status: FieldTourStatus;
  completion: number;
};

export type CreateFieldTourInput = Omit<FieldTour, "id">;

type FieldTourListResponse = ApiResponse<FieldTourDTO[]>;
type FieldTourResponse = ApiResponse<FieldTourDTO>;

const mapTour = (dto: FieldTourDTO): FieldTour => ({
  id: String(dto.id),
  name: dto.name,
  neighborhood: dto.neighborhood,
  date: dto.scheduled_for,
  canvassersNeeded: dto.canvassers_needed,
  assignedVolunteers: dto.assigned_volunteers,
  status: dto.status,
  completion: dto.completion,
});

const serializeTour = (input: CreateFieldTourInput) => ({
  name: input.name,
  neighborhood: input.neighborhood,
  scheduled_for: input.date,
  canvassers_needed: input.canvassersNeeded,
  assigned_volunteers: input.assignedVolunteers,
  status: input.status,
  completion: input.completion,
});

export const fieldTourService = {
  async list() {
    const { data } = await apiClient.get<FieldTourListResponse>("/tours");
    return (data.data ?? []).map(mapTour);
  },
  async create(input: CreateFieldTourInput) {
    const { data } = await apiClient.post<FieldTourResponse>("/tours", serializeTour(input));
    return data.data ? mapTour(data.data) : undefined;
  },
  async updateStatus(id: string, status: FieldTourStatus) {
    const { data } = await apiClient.patch<FieldTourResponse>(`/tours/${id}`, {
      status,
    });

    return data.data ? mapTour(data.data) : undefined;
  },
};
