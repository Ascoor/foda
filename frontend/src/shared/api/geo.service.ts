import { request } from "@shared/lib/api";
import { API_ENDPOINTS } from "@shared/lib/endpoints";
import { safeArray } from "@shared/lib/utils";

export interface GovernorateOption {
  id: number;
  name: string;
}

export interface DistrictOption {
  id: number;
  governorate_id: number;
  name: string;
}

export interface ElectoralCircleOption {
  id: number;
  district_id: number;
  name: string;
}

export const fetchGovernorates = async (): Promise<GovernorateOption[]> => {
  try {
    const response = await request<{ data?: GovernorateOption[] }>({
      url: API_ENDPOINTS.geo.governorates,
      method: "get",
      useCache: true,
    });

    return safeArray(response.data);
  } catch (error) {
    console.warn("Failed to load governorates", error);
    return [];
  }
};

export const fetchGovernorateDistricts = async (
  governorateId: string,
): Promise<DistrictOption[]> => {
  if (!governorateId) {
    return [];
  }

  try {
    const response = await request<{ data?: DistrictOption[] }>({
      url: API_ENDPOINTS.geo.governorateDistricts(governorateId),
      method: "get",
      useCache: true,
    });

    return safeArray(response.data);
  } catch (error) {
    console.warn("Failed to load districts", error);
    return [];
  }
};

export const fetchDistrictElectoralCircles = async (
  districtId: string,
): Promise<ElectoralCircleOption[]> => {
  if (!districtId) {
    return [];
  }

  try {
    const response = await request<{ data?: ElectoralCircleOption[] }>({
      url: API_ENDPOINTS.geo.districtElectoralCircles(districtId),
      method: "get",
      useCache: true,
    });

    return safeArray(response.data);
  } catch (error) {
    console.warn("Failed to load electoral circles", error);
    return [];
  }
};
