import type { ReactNode } from "react";
import type { Role } from "@shared/contexts/role-context";
import { useRole } from "@shared/contexts/role-context";

type RoleGateProps = {
  allow: Role[];
  children: ReactNode;
};

export const RoleGate = ({ allow, children }: RoleGateProps) => {
  const { role } = useRole();
  if (!role || !allow.includes(role)) return null;
  return <>{children}</>;
};
