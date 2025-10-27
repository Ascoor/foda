import type { Role, User } from "./auth.types";

const getCandidateToken = (payload: Record<string, unknown>): unknown =>
  payload.token ?? payload.access_token ?? payload.authToken ?? payload.data;

export const extractToken = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = getCandidateToken(payload as Record<string, unknown>);

  if (typeof candidate === "string") {
    return candidate;
  }

  if (candidate && typeof candidate === "object") {
    const nested = candidate as Record<string, unknown>;
    const nestedToken = nested.token ?? nested.access_token ?? nested.authToken;
    return typeof nestedToken === "string" ? nestedToken : null;
  }

  return null;
};

const normalizeRoles = (raw: unknown): Role[] => {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .filter((role): role is Role | string => Boolean(role))
    .map((role) => {
      if (typeof role === "string") {
        return { name: role };
      }

      return {
        ...role,
        name: String((role as Role)?.name ?? ""),
      } satisfies Role;
    })
    .filter((role) => role.name.length > 0);
};

export const normalizeUser = (payload: unknown): User => {
  const raw =
    (payload as Record<string, unknown>)?.data ??
    (payload as Record<string, unknown>)?.user ??
    payload;

  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid user payload received from API");
  }

  const base = raw as Record<string, unknown>;
  const roles = normalizeRoles(base.roles);

  return {
    ...(base as User),
    roles,
    roleNames: roles.map((role) => role.name),
  } satisfies User;
};
