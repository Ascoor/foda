export type VoterStatus = "supporter" | "leaning" | "undecided" | "opposed" | "unknown";

export type VoterInteraction = {
  id: string;
  date: string;
  channel: "call" | "door" | "sms" | "email";
  outcome: string;
  notes?: string;
};

export type Voter = {
  id: string;
  fullName: string;
  precinct: string;
  address: string;
  phone?: string;
  email?: string;
  preferredContact: "phone" | "sms" | "email" | "in-person";
  status: VoterStatus;
  likelihoodScore: number;
  lastContacted?: string;
  notes?: string;
  interactions: VoterInteraction[];
};

export type CreateVoterInput = Omit<Voter, "id" | "interactions"> & {
  interactions?: VoterInteraction[];
};

export type VoterFilters = {
  search?: string;
  status?: VoterStatus | "all";
  precinct?: string;
  minScore?: number;
};

export type VoterInteractionInput = Omit<VoterInteraction, "id" | "date"> & {
  date?: string;
};

const createId = () => Math.random().toString(36).slice(2, 10);

const mockVoters: Voter[] = [
  {
    id: createId(),
    fullName: "Layla Hassan",
    precinct: "North Ridge",
    address: "102 Greenway Ave",
    phone: "555-218-4433",
    email: "layla.hassan@example.com",
    preferredContact: "phone",
    status: "supporter",
    likelihoodScore: 82,
    lastContacted: "2024-08-17",
    notes: "Requested yard sign and prefers morning calls.",
    interactions: [
      {
        id: createId(),
        date: "2024-08-17",
        channel: "door",
        outcome: "confirmed",
        notes: "Met at home, confirmed early voting plan.",
      },
    ],
  },
  {
    id: createId(),
    fullName: "Omar Khaled",
    precinct: "Riverfront",
    address: "88 Lakeside Blvd",
    phone: "555-339-1188",
    email: "omar.khaled@example.com",
    preferredContact: "sms",
    status: "leaning",
    likelihoodScore: 68,
    lastContacted: "2024-08-10",
    notes: "Works night shifts—best reached via SMS.",
    interactions: [
      {
        id: createId(),
        date: "2024-08-10",
        channel: "sms",
        outcome: "follow-up",
        notes: "Asked for absentee ballot information.",
      },
    ],
  },
  {
    id: createId(),
    fullName: "Sara Ibrahim",
    precinct: "Downtown",
    address: "12 Market Street",
    phone: "555-102-7788",
    preferredContact: "in-person",
    status: "undecided",
    likelihoodScore: 55,
    notes: "Interested in housing policy details.",
    interactions: [],
  },
];

let voters = [...mockVoters];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const applyFilters = (items: Voter[], filters?: VoterFilters) => {
  if (!filters) return items;

  return items.filter((voter) => {
    const matchesSearch = filters.search
      ? voter.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        voter.precinct.toLowerCase().includes(filters.search.toLowerCase())
      : true;

    const matchesStatus = filters.status && filters.status !== "all" ? voter.status === filters.status : true;

    const matchesPrecinct = filters.precinct ? voter.precinct === filters.precinct : true;

    const matchesScore = typeof filters.minScore === "number" ? voter.likelihoodScore >= filters.minScore : true;

    return matchesSearch && matchesStatus && matchesPrecinct && matchesScore;
  });
};

const ensureDate = (value?: string) => value ?? new Date().toISOString().slice(0, 10);

export const voterService = {
  async getVoters(filters?: VoterFilters) {
    return applyFilters(clone(voters), filters);
  },
  async createVoter(input: CreateVoterInput) {
    const newVoter: Voter = {
      ...input,
      id: createId(),
      interactions: clone(input.interactions ?? []),
      lastContacted: input.lastContacted,
    };

    voters = [...voters, newVoter];
    return clone(newVoter);
  },
  async updateVoterStatus(id: string, status: VoterStatus) {
    voters = voters.map((voter) =>
      voter.id === id
        ? {
            ...voter,
            status,
          }
        : voter,
    );

    const updated = voters.find((voter) => voter.id === id);
    return updated ? clone(updated) : undefined;
  },
  async logInteraction(id: string, interactionInput: VoterInteractionInput) {
    const interaction: VoterInteraction = {
      id: createId(),
      date: ensureDate(interactionInput.date),
      channel: interactionInput.channel,
      outcome: interactionInput.outcome,
      notes: interactionInput.notes,
    };

    voters = voters.map((voter) =>
      voter.id === id
        ? {
            ...voter,
            interactions: [interaction, ...voter.interactions],
            lastContacted: interaction.date,
          }
        : voter,
    );

    const updated = voters.find((voter) => voter.id === id);
    return updated ? clone(updated) : undefined;
  },
  async getPrecincts() {
    const uniquePrecincts = Array.from(new Set(voters.map((voter) => voter.precinct))).sort();
    return uniquePrecincts;
  },
};
