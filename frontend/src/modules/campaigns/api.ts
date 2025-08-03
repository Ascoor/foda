import { request } from '../../lib/api';
import { Campaign, CampaignFormData } from './types';

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const { data } = await request<{ data: Campaign[] }>({
    url: '/ec/campaigns',
    method: 'get',
  });
  return data;
};

export const createCampaign = async (
  payload: CampaignFormData
): Promise<Campaign> => {
  const { data } = await request<{ data: Campaign }>({
    url: '/ec/campaigns',
    method: 'post',
    data: payload,
  });
  return data;
};

export const updateCampaign = async (
  id: string,
  payload: Partial<CampaignFormData>
): Promise<Campaign> => {
  const { data } = await request<{ data: Campaign }>({
    url: `/ec/campaigns/${id}`,
    method: 'put',
    data: payload,
  });
  return data;
};

export const deleteCampaign = async (id: string): Promise<void> => {
  await request({ url: `/ec/campaigns/${id}`, method: 'delete' });
};

// Assumes backend provides an endpoint to trigger sending a campaign
export const sendCampaign = async (id: string): Promise<void> => {
  await request({ url: `/ec/campaigns/${id}/send`, method: 'post' });
};
