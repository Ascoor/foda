import { apiClient, ApiResponse } from "@/shared/api/config";
import { VolunteerDTO } from "@/shared/api/dtos";

export type VolunteerStatus = VolunteerDTO["status"];

export type Volunteer = {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  neighborhood: string;
  status: VolunteerStatus;
  skills: string[];
  availability: string;
  hoursThisWeek: number;
  assignedTasks: string[];
};

export type CreateVolunteerInput = Omit<Volunteer, "id">;

type VolunteerListResponse = ApiResponse<VolunteerDTO[]>;
type VolunteerResponse = ApiResponse<VolunteerDTO>;

const mapVolunteer = (dto: VolunteerDTO): Volunteer => ({
  id: String(dto.id),
  fullName: dto.full_name,
  phone: dto.phone,
  email: dto.email,
  neighborhood: dto.neighborhood,
  status: dto.status,
  skills: dto.skills ?? [],
  availability: dto.availability ?? "",
  hoursThisWeek: dto.hours_this_week ?? 0,
  assignedTasks: dto.assigned_tasks ?? [],
});

const serializeVolunteer = (input: CreateVolunteerInput) => ({
  full_name: input.fullName,
  phone: input.phone,
  email: input.email,
  neighborhood: input.neighborhood,
  status: input.status,
  skills: input.skills,
  availability: input.availability,
  hours_this_week: input.hoursThisWeek,
  assigned_tasks: input.assignedTasks,
});

export const volunteerService = {
  async list() {
    const { data } = await apiClient.get<VolunteerListResponse>("/volunteers");
    return (data.data ?? []).map(mapVolunteer);
  },
  async create(input: CreateVolunteerInput) {
    const { data } = await apiClient.post<VolunteerResponse>(
      "/volunteers",
      serializeVolunteer(input),
    );

    return data.data ? mapVolunteer(data.data) : undefined;
  },
  async updateStatus(id: string, status: VolunteerStatus) {
    const { data } = await apiClient.patch<VolunteerResponse>(`/volunteers/${id}`, {
      status,
    });

    return data.data ? mapVolunteer(data.data) : undefined;
  },
};
