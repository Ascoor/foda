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

export interface CircleOption {
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

export const fetchDistricts = async (
  governorateId?: number | null,
): Promise<DistrictOption[]> => {
  try {
    const response = await request<{ data?: DistrictOption[] }>({
      url: API_ENDPOINTS.geo.districts,
      method: "get",
      params: governorateId ? { governorate_id: governorateId } : undefined,
      useCache: true,
    });

    return safeArray(response.data);
  } catch (error) {
    console.warn("Failed to load districts", error);
    return [];
  }
};

export const fetchCircles = async (
  districtId?: number | null,
): Promise<CircleOption[]> => {
  try {
    const response = await request<{ data?: CircleOption[] }>({
      url: API_ENDPOINTS.geo.circles,
      method: "get",
      params: districtId ? { district_id: districtId } : undefined,
      useCache: true,
    });

    return safeArray(response.data);
  } catch (error) {
    console.warn("Failed to load circles", error);
    return [];
  }
};
