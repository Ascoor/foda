export interface Campaign {
  id: string;
  name: string;
  message: string;
  sent: number;
  delivered: number;
  created_at: string;
}

export interface CampaignFormData {
  name: string;
  message: string;
}
