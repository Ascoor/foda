import { createContext, useContext } from "react";

export type Role =
  | "admin"
  | "supervisor"
  | "organizer"
  | "volunteer"
  | "viewer"
  | (string & {});

export const RoleContext = createContext<{ role?: Role }>({});

export const useRole = () => useContext(RoleContext);
