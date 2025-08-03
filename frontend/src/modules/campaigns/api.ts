import { Campaign, CampaignFormData } from './types';

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Campaign A',
    message: 'Hello voters',
    sent: 100,
    delivered: 90,
    created_at: new Date().toISOString(),
  },
];

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return [...mockCampaigns];
};

export const createCampaign = async (data: CampaignFormData): Promise<Campaign> => {
  await new Promise((r) => setTimeout(r, 500));
  const c: Campaign = {
    id: Math.random().toString(36).slice(2, 9),
    name: data.name,
    message: data.message,
    sent: 0,
    delivered: 0,
    created_at: new Date().toISOString(),
  };
  mockCampaigns.push(c);
  return c;
};

export const updateCampaign = async (id: string, data: Partial<CampaignFormData>): Promise<Campaign> => {
  await new Promise((r) => setTimeout(r, 500));
  const c = mockCampaigns.find((m) => m.id === id);
  if (!c) throw new Error('Campaign not found');
  Object.assign(c, data);
  return c;
};

export const deleteCampaign = async (id: string): Promise<void> => {
  await new Promise((r) => setTimeout(r, 500));
};

export const sendCampaign = async (id: string): Promise<void> => {
  await new Promise((r) => setTimeout(r, 500));
  const c = mockCampaigns.find((m) => m.id === id);
  if (c) {
    c.sent += 100;
    c.delivered += 90;
  }
};
