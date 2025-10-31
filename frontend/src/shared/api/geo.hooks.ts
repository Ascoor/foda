import { useQuery } from "@tanstack/react-query";

import { fetchCircles, fetchDistricts, fetchGovernorates } from "./geo.service";

export const useGovernorates = () =>
  useQuery({
    queryKey: ["geo", "governorates"],
    queryFn: fetchGovernorates,
    staleTime: 1000 * 60 * 30,
  });

export const useDistricts = (governorateId?: number | null) =>
  useQuery({
    queryKey: ["geo", "governorates", governorateId ?? null, "districts"],
    queryFn: () => fetchDistricts(governorateId),
    enabled: typeof governorateId === "number" && governorateId > 0,
    staleTime: 1000 * 60 * 15,
  });

export const useCircles = (districtId?: number | null) =>
  useQuery({
    queryKey: ["geo", "districts", districtId ?? null, "circles"],
    queryFn: () => fetchCircles(districtId),
    enabled: typeof districtId === "number" && districtId > 0,
    staleTime: 1000 * 60 * 15,
  });
