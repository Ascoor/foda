import { apiClient, ApiResponse } from "@/shared/api/config";
import {
  CampaignConfigDTO,
  CampaignUserDTO,
  PermissionGroupDTO,
} from "@/shared/api/dtos";

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  role: CampaignUserDTO["role"];
  status: CampaignUserDTO["status"];
};

export type CampaignConfig = {
  electionDate: string;
  headquarters: string;
  defaultLanguage: string;
  contactEmail: string;
  campaignName?: string;
  primaryColor?: string;
  logoUrl?: string;
};

export type PermissionGroup = {
  id: string;
  title: string;
  description: string;
  roles: string[];
};

export type UpsertUserInput = {
  id?: string;
  name: string;
  email: string;
  role: CampaignUserDTO["role"];
  status?: CampaignUserDTO["status"];
};

export type UpdateCampaignConfigInput = CampaignConfig;

type UsersResponse = ApiResponse<CampaignUserDTO[]>;
type UserResponse = ApiResponse<CampaignUserDTO>;
type ConfigResponse = ApiResponse<CampaignConfigDTO>;
type PermissionsResponse = ApiResponse<PermissionGroupDTO[]>;

const mapUser = (dto: CampaignUserDTO): UserAccount => ({
  id: String(dto.id),
  name: dto.name,
  email: dto.email,
  role: dto.role,
  status: dto.status,
});

const mapConfig = (dto: CampaignConfigDTO): CampaignConfig => ({
  electionDate: dto.election_date,
  headquarters: dto.headquarters,
  defaultLanguage: dto.default_language,
  contactEmail: dto.contact_email,
  campaignName: dto.campaign_name,
  primaryColor: dto.branding?.primary_color,
  logoUrl: dto.branding?.logo_url,
});

const mapPermission = (dto: PermissionGroupDTO): PermissionGroup => ({
  id: String(dto.id),
  title: dto.title,
  description: dto.description,
  roles: dto.roles,
});

export const settingsService = {
  async listUsers() {
    const { data } = await apiClient.get<UsersResponse>("/settings/users");
    return (data.data ?? []).map(mapUser);
  },
  async upsertUser(input: UpsertUserInput) {
    const { data } = await apiClient.post<UserResponse>("/settings/user", {
      id: input.id,
      name: input.name,
      email: input.email,
      role: input.role,
      status: input.status,
    });

    return data.data ? mapUser(data.data) : undefined;
  },
  async getCampaignConfig() {
    const { data } = await apiClient.get<ConfigResponse>("/settings/config");
    return data.data ? mapConfig(data.data) : undefined;
  },
  async saveCampaignConfig(input: UpdateCampaignConfigInput) {
    const { data } = await apiClient.put<ConfigResponse>("/settings/config", {
      election_date: input.electionDate,
      headquarters: input.headquarters,
      default_language: input.defaultLanguage,
      contact_email: input.contactEmail,
      campaign_name: input.campaignName,
      branding: {
        primary_color: input.primaryColor,
        logo_url: input.logoUrl,
      },
    });

    return data.data ? mapConfig(data.data) : undefined;
  },
  async listPermissionGroups() {
    const { data } = await apiClient.get<PermissionsResponse>("/settings/permissions");
    return (data.data ?? []).map(mapPermission);
  },
  async auditLog() {
    const { data } = await apiClient.get<ApiResponse<Record<string, unknown>[]>>(
      "/settings/audit",
    );
    return data.data ?? [];
  },
};
