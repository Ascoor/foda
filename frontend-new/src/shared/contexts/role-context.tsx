import { createContext, useContext } from "react";

export type Role = "admin" | "supervisor" | "volunteer";

export const RoleContext = createContext<{ role?: Role }>({});

export const useRole = () => useContext(RoleContext);
