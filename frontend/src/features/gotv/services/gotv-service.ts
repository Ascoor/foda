import { apiClient, ApiResponse } from "@/shared/api/config";
import {
  GotvStreamPayload,
  GotvVoterDTO,
  NotificationDTO,
} from "@/shared/api/dtos";
import { NotificationItem } from "@/shared/contexts/notification-context";

export type GotvVoter = {
  id: string;
  fullName: string;
  precinct: string;
  phone?: string;
  priority: "high" | "medium" | "low";
  hasVoted: boolean;
  attendanceRate?: number;
};

type GotvReportResponse = ApiResponse<GotvVoterDTO[]>;
type GotvResultResponse = ApiResponse<GotvVoterDTO>;

type NotificationResponse = ApiResponse<NotificationDTO>;

const toNotificationItem = (dto: NotificationDTO): NotificationItem => ({
  ...dto,
  createdAgo: new Date(dto.created_at).toLocaleString(),
});

const mapFromDto = (dto: GotvVoterDTO): GotvVoter => ({
  id: String(dto.id),
  fullName: dto.full_name,
  precinct: dto.precinct,
  phone: dto.phone,
  priority: dto.priority,
  hasVoted: dto.has_voted,
  attendanceRate: dto.attendance_rate,
});

const createAlertFromPayload = (payload: GotvStreamPayload): NotificationItem => ({
  id: `turnout-${payload.voter.id}-${payload.turnout.total_checked_in}`,
  type: payload.turnout.attendance_rate < 0.35 ? "risk" : "field",
  category: `Precinct ${payload.turnout.precinct}`,
  title:
    payload.turnout.attendance_rate < 0.35
      ? "Turnout slipping"
      : "Attendance update",
  message: `Turnout in ${payload.turnout.precinct} is ${Math.round(
    payload.turnout.attendance_rate * 100,
  )}% with ${payload.turnout.total_checked_in} check-ins.`,
  priority: payload.turnout.attendance_rate < 0.35 ? "high" : "medium",
  meta: payload,
  read_at: null,
  created_at: new Date().toISOString(),
  createdAgo: new Date().toLocaleTimeString(),
});

export const gotvService = {
  mapFromDto,
  createAlertFromPayload,
  async list(): Promise<GotvVoter[]> {
    const { data } = await apiClient.get<GotvReportResponse>("/gotv/report");
    return (data.data ?? []).map(mapFromDto);
  },
  async markVoted(id: string, hasVoted: boolean) {
    const { data } = await apiClient.post<GotvResultResponse>("/gotv/result", {
      voter_id: id,
      has_voted: hasVoted,
    });

    if (!data.data) return undefined;
    return mapFromDto(data.data);
  },
  async acknowledgeAlert(id: NotificationItem["id"]) {
    await apiClient.post<NotificationResponse>(`/notifications/${id}/acknowledge`);
  },
  createNotificationFromDto: toNotificationItem,
};
