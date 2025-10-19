export type FieldTourStatus = "draft" | "scheduled" | "in-progress" | "completed";

export type FieldTour = {
  id: string;
  name: string;
  neighborhood: string;
  date: string;
  canvassersNeeded: number;
  assignedVolunteers: string[];
  status: FieldTourStatus;
  completion: number;
};

export type CreateFieldTourInput = Omit<FieldTour, "id" | "completion" | "status"> & {
  status?: FieldTourStatus;
  completion?: number;
};

const createId = () => Math.random().toString(36).slice(2, 9);

let tours: FieldTour[] = [
  {
    id: createId(),
    name: "Downtown Morning Sweep",
    neighborhood: "Downtown",
    date: "2024-08-24",
    canvassersNeeded: 6,
    assignedVolunteers: ["Maya", "Zaid", "Hana"],
    status: "scheduled",
    completion: 10,
  },
  {
    id: createId(),
    name: "Riverfront Evening Shift",
    neighborhood: "Riverfront",
    date: "2024-08-25",
    canvassersNeeded: 4,
    assignedVolunteers: ["Omar", "Leila"],
    status: "in-progress",
    completion: 55,
  },
];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const fieldTourService = {
  async list() {
    return clone(tours);
  },
  async create(input: CreateFieldTourInput) {
    const tour: FieldTour = {
      ...input,
      id: createId(),
      status: input.status ?? "draft",
      completion: input.completion ?? 0,
    };

    tours = [...tours, tour];
    return clone(tour);
  },
  async updateStatus(id: string, status: FieldTourStatus) {
    tours = tours.map((tour) =>
      tour.id === id
        ? {
            ...tour,
            status,
          }
        : tour,
    );

    const updated = tours.find((tour) => tour.id === id);
    return updated ? clone(updated) : undefined;
  },
};
