export type Identifier = string | number;

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface VoterInteractionDTO {
  id: Identifier;
  channel: "call" | "door" | "sms" | "email";
  outcome: string;
  notes?: string;
  occurred_at: string;
}

export interface VoterDTO {
  id: Identifier;
  first_name: string;
  last_name: string;
  precinct: string;
  address?: string;
  phone?: string;
  email?: string;
  preferred_contact: "phone" | "sms" | "email" | "in-person";
  status: "supporter" | "leaning" | "undecided" | "opposed" | "unknown";
  likelihood_score: number;
  last_contacted?: string | null;
  notes?: string | null;
  interactions?: VoterInteractionDTO[];
}

export interface VolunteerDTO {
  id: Identifier;
  full_name: string;
  phone?: string;
  email?: string;
  neighborhood: string;
  status: "active" | "inactive" | "training";
  skills?: string[];
  availability?: string;
  hours_this_week?: number;
  assigned_tasks?: string[];
}

export interface FieldTourDTO {
  id: Identifier;
  name: string;
  neighborhood: string;
  scheduled_for: string;
  canvassers_needed: number;
  assigned_volunteers: string[];
  status: "draft" | "scheduled" | "in-progress" | "completed";
  completion: number;
}

export interface DonationDTO {
  id: Identifier;
  donor_name: string;
  amount: number;
  method: "cash" | "card" | "check" | "online";
  donated_at: string;
  notes?: string | null;
}

export interface DonationTotalsDTO {
  total: number;
  average: number;
  count: number;
}

export interface GotvVoterDTO {
  id: Identifier;
  full_name: string;
  precinct: string;
  phone?: string;
  priority: "high" | "medium" | "low";
  has_voted: boolean;
  attendance_rate?: number;
}

export interface GotvStreamPayload {
  voter: GotvVoterDTO;
  turnout: {
    precinct: string;
    attendance_rate: number;
    total_checked_in: number;
  };
}

export interface NotificationDTO {
  id: Identifier;
  type: "performance" | "field" | "risk" | "other" | "success";
  category: string;
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  meta?: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

export interface CampaignMessageDTO {
  id: Identifier;
  channel: "sms" | "email";
  recipient: string;
  body: string;
  sent_at: string;
}

export interface CampaignMessageInputDTO {
  channel: "sms" | "email";
  recipient: string;
  body: string;
  segment?: string;
}

export interface CampaignUserDTO {
  id: Identifier;
  name: string;
  email: string;
  role: "admin" | "organizer" | "volunteer";
  status: "active" | "invited";
}

export interface CampaignConfigDTO {
  election_date: string;
  headquarters: string;
  default_language: string;
  contact_email: string;
  campaign_name?: string;
  branding?: {
    logo_url?: string;
    primary_color?: string;
  };
}

export interface PermissionGroupDTO {
  id: Identifier;
  title: string;
  description: string;
  roles: string[];
}

export interface AnalyticsKpiDTO {
  id: string;
  label: string;
  value: string;
  trend: "up" | "down" | "steady";
  delta: string;
}

export interface AnalyticsTimeSeriesPointDTO {
  label: string;
  supporters: number;
  undecided: number;
}

export interface VolunteerProgressPointDTO {
  week: string;
  trained: number;
  active: number;
}

export interface HeatMapCellDTO {
  neighborhood: string;
  contact_rate: number;
}
