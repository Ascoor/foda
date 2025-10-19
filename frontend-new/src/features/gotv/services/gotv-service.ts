export type GotvVoter = {
  id: string;
  fullName: string;
  precinct: string;
  phone?: string;
  priority: "high" | "medium" | "low";
  hasVoted: boolean;
};

const createId = () => Math.random().toString(36).slice(2, 9);

let gotvList: GotvVoter[] = [
  { id: createId(), fullName: "Layla Hassan", precinct: "North Ridge", phone: "555-123-8899", priority: "high", hasVoted: false },
  { id: createId(), fullName: "Omar Khaled", precinct: "Riverfront", phone: "555-777-2345", priority: "medium", hasVoted: false },
  { id: createId(), fullName: "Sara Ibrahim", precinct: "Downtown", priority: "high", hasVoted: true },
];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const gotvService = {
  async list() {
    return clone(gotvList);
  },
  async markVoted(id: string, hasVoted: boolean) {
    gotvList = gotvList.map((voter) => (voter.id === id ? { ...voter, hasVoted } : voter));
    return clone(gotvList.find((voter) => voter.id === id));
  },
};
