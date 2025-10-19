export type UserAccount = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "organizer" | "volunteer";
  status: "active" | "invited";
};

export type CampaignConfig = {
  electionDate: string;
  headquarters: string;
  defaultLanguage: string;
  contactEmail: string;
};

export type PermissionGroup = {
  id: string;
  title: string;
  description: string;
  roles: string[];
};

const users: UserAccount[] = [
  { id: "1", name: "Campaign Admin", email: "admin@campaign.org", role: "admin", status: "active" },
  { id: "2", name: "Field Director", email: "field@campaign.org", role: "organizer", status: "active" },
  { id: "3", name: "Volunteer Lead", email: "volunteer@campaign.org", role: "volunteer", status: "invited" },
];

const campaignConfig: CampaignConfig = {
  electionDate: "2024-11-05",
  headquarters: "123 Unity Plaza, Downtown",
  defaultLanguage: "English",
  contactEmail: "hello@campaign.org",
};

const permissionGroups: PermissionGroup[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Access to campaign overview and metrics",
    roles: ["admin", "organizer"],
  },
  {
    id: "field",
    title: "Field tools",
    description: "Manage voters, turf, and shifts",
    roles: ["admin", "organizer"],
  },
  {
    id: "volunteer",
    title: "Volunteer portal",
    description: "Check assignments, log shifts",
    roles: ["admin", "organizer", "volunteer"],
  },
];

export const settingsService = {
  async listUsers() {
    return users;
  },
  async getCampaignConfig() {
    return campaignConfig;
  },
  async listPermissionGroups() {
    return permissionGroups;
  },
};
