export type DonationMethod = "cash" | "card" | "check" | "online";

export type Donation = {
  id: string;
  donorName: string;
  amount: number;
  method: DonationMethod;
  date: string;
  notes?: string;
};

export type CreateDonationInput = Omit<Donation, "id">;

const createId = () => Math.random().toString(36).slice(2, 9);

let donations: Donation[] = [
  {
    id: createId(),
    donorName: "North Ridge PAC",
    amount: 250,
    method: "check",
    date: "2024-08-16",
    notes: "Pick up deposit from campaign office",
  },
  {
    id: createId(),
    donorName: "Layla Hassan",
    amount: 50,
    method: "online",
    date: "2024-08-15",
  },
];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const donationService = {
  async list() {
    return clone(donations);
  },
  async create(input: CreateDonationInput) {
    const donation: Donation = { ...input, id: createId() };
    donations = [donation, ...donations];
    return clone(donation);
  },
  async totals() {
    const total = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const average = donations.length > 0 ? total / donations.length : 0;
    return {
      total,
      average,
      count: donations.length,
    };
  },
};
