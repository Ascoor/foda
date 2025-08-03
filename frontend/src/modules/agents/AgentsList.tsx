import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Eye, Edit, Trash2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssignDialog } from '@/components/ui/AssignDialog';
import { Agent, AgentFilters } from './types';
import { fetchAgents, deleteAgent, assignAgent, mockCommittees } from './api';
import { AgentForm } from './AgentForm';
import { AgentDetails } from './AgentDetails';

export const AgentsList = () => {
  const { t } = useTranslation();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filters, setFilters] = useState<AgentFilters>({});
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selected, setSelected] = useState<Agent | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchAgents(filters);
    setAgents(data);
    setIsLoading(false);
  }, [filters]);

  useEffect(() => { load(); }, [load]);
  const filtered = agents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => { setSelected(null); setShowForm(true); };
  const handleEdit = (a: Agent) => { setSelected(a); setShowForm(true); };
  const handleView = (a: Agent) => { setSelected(a); setShowDetails(true); };
  const handleAssign = (a: Agent) => { setSelected(a); setShowAssign(true); };

  const onAssign = async (ids: string[]) => {
    if (selected && ids[0]) {
      await assignAgent(selected.id, ids[0]);
      setShowAssign(false);
      load();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gradient-primary">{t('agents.title')}</h1>
        <Button onClick={handleAdd} className="bg-gradient-primary text-white">
          <Plus className="h-4 w-4 mr-2" />{t('agents.add_agent')}
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search') ?? 'Search'}
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select onValueChange={v => setFilters(f => ({ ...f, role: v }))}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t('agents.role')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="observer">Observer</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto glass-card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">{t('agents.agent_name')}</th>
              <th className="px-4 py-2">{t('agents.mobile')}</th>
              <th className="px-4 py-2">{t('agents.role')}</th>
              <th className="px-4 py-2">{t('agents.assigned_committee')}</th>
              <th className="px-4 py-2">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-t border-white/10">
                <td className="px-4 py-2">{a.name}</td>
                <td className="px-4 py-2">{a.mobile}</td>
                <td className="px-4 py-2">{a.role}</td>
                <td className="px-4 py-2">{a.committee_name || '-'}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleView(a)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(a)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleAssign(a)}>
                    <UserCheck className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteAgent(a.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted-foreground">
                  {t('common.no_data') || 'No data'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AgentForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setSelected(null); }}
        onSuccess={() => { setShowForm(false); load(); }}
        agent={selected}
      />
      <AgentDetails
        isOpen={showDetails}
        onClose={() => { setShowDetails(false); setSelected(null); }}
        agent={selected}
        onEdit={a => { setShowDetails(false); handleEdit(a); }}
      />
      <AssignDialog
        isOpen={showAssign}
        onClose={() => setShowAssign(false)}
        title={t('agents.assigned_committee')}
        items={mockCommittees.map(c => ({ id: c.id, name: c.name }))}
        onAssign={onAssign}
        multiSelect={false}
      />
    </div>
  );
};
