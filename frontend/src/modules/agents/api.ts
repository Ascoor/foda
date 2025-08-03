import { Agent, AgentFormData, AgentFilters } from './types';

export const mockAgents: Agent[] = [
  { id: '1', name: 'Agent A', mobile: '+201000000000', role: 'observer', committee_id: '1', committee_name: 'Committee 001' },
  { id: '2', name: 'Agent B', mobile: '+201111111111', role: 'supervisor', committee_id: null }
];

export const mockCommittees = [
  { id: '1', name: 'Committee 001' },
  { id: '2', name: 'Committee 002' }
];

export const fetchAgents = async (filters?: AgentFilters): Promise<Agent[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  let data = [...mockAgents];
  if (filters?.role) data = data.filter(a => a.role === filters.role);
  if (filters?.committee_id) data = data.filter(a => a.committee_id === filters.committee_id);
  return data;
};

export const createAgent = async (data: AgentFormData): Promise<Agent> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const agent: Agent = { ...data, id: Math.random().toString(36).slice(2, 9) };
  mockAgents.push(agent);
  return agent;
};

export const updateAgent = async (id: string, data: Partial<AgentFormData>): Promise<Agent> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const agent = mockAgents.find(a => a.id === id);
  if (!agent) throw new Error('Agent not found');
  Object.assign(agent, data);
  return agent;
};

export const deleteAgent = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const assignAgent = async (id: string, committeeId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const agent = mockAgents.find(a => a.id === id);
  if (agent) {
    agent.committee_id = committeeId;
    const committee = mockCommittees.find(c => c.id === committeeId);
    agent.committee_name = committee?.name;
  }
};

export const exportAgents = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};
