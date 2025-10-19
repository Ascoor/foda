export type VolunteerStatus = "active" | "inactive" | "training";

export type Volunteer = {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  neighborhood: string;
  status: VolunteerStatus;
  skills: string[];
  availability: string;
  hoursThisWeek: number;
  assignedTasks: string[];
};

export type CreateVolunteerInput = Omit<Volunteer, "id">;

const createId = () => Math.random().toString(36).slice(2, 9);

const mockVolunteers: Volunteer[] = [
  {
    id: createId(),
    fullName: "Maya Al-Hassan",
    phone: "555-980-2231",
    email: "maya.alhassan@example.com",
    neighborhood: "North Ridge",
    status: "active",
    skills: ["door knocking", "data entry"],
    availability: "Weekdays 5-8pm",
    hoursThisWeek: 6,
    assignedTasks: ["Canvassing shift", "Data cleanup"],
  },
  {
    id: createId(),
    fullName: "Zaid Kareem",
    phone: "555-412-7788",
    neighborhood: "Riverfront",
    status: "training",
    skills: ["phone banking"],
    availability: "Weekends",
    hoursThisWeek: 3,
    assignedTasks: ["Phone bank onboarding"],
  },
  {
    id: createId(),
    fullName: "Hana Youssef",
    email: "hana.youssef@example.com",
    neighborhood: "Downtown",
    status: "inactive",
    skills: ["community outreach"],
    availability: "On call",
    hoursThisWeek: 0,
    assignedTasks: [],
  },
];

let volunteers = [...mockVolunteers];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const volunteerService = {
  async list() {
    return clone(volunteers);
  },
  async create(input: CreateVolunteerInput) {
    const volunteer: Volunteer = { ...input, id: createId() };
    volunteers = [...volunteers, volunteer];
    return clone(volunteer);
  },
  async updateStatus(id: string, status: VolunteerStatus) {
    volunteers = volunteers.map((volunteer) =>
      volunteer.id === id
        ? {
            ...volunteer,
            status,
          }
        : volunteer,
    );

    const updated = volunteers.find((volunteer) => volunteer.id === id);
    return updated ? clone(updated) : undefined;
  },
};
