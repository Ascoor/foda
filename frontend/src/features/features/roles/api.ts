import { request } from "@/infrastructure/shared/lib/api";
import type { RoleRecord, RolesResponse } from "./types";

export const fetchRoles = () =>
  request<RolesResponse>({
    url: "/api/v1/roles",
    method: "GET",
  });

export const updateRole = (
  roleId: number,
  payload: Partial<RoleRecord> & { permissions?: string[] },
) =>
  request<{ data: RoleRecord }>({
    url: `/api/v1/roles/${roleId}`,
    method: "PUT",
    data: payload,
  });
