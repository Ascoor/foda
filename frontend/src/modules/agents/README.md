import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Eye, Edit, Trash2, UserCheck, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssignDialog } from '@/components/ui/AssignDialog';
import { SafeDataRenderer } from '@/components/ui/SafeDataRenderer';
import { Agent, AgentFilters } from './types';
import { fetchAgents, deleteAgent, assignAgent, mockCommittees, exportAgents } from './api';
import { AgentForm } from './AgentForm';
import { AgentDetails } from './AgentDetails';
import { safeArray } from '@/lib/safeData';
import { useToast } from '@/hooks/use-toast';

export const AgentsList = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filters, setFilters] = useState<AgentFilters>({});
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selected, setSelected] = useState<Agent | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAgents(filters);
      setAgents(safeArray(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agents');
      setAgents([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);
  
  const filteredAgents = safeArray(agents).filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => { setSelected(null); setShowForm(true); };
  const handleEdit = (a: Agent) => { setSelected(a); setShowForm(true); };
  const handleView = (a: Agent) => { setSelected(a); setShowDetails(true); };
  const handleAssign = (a: Agent) => { setSelected(a); setShowAssign(true); };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteAgent(id);
      toast({ title: t('common.delete'), description: 'Agent deleted successfully' });
      load();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete agent', variant: 'destructive' });
    }
  };

  const handleExport = async () => {
    try {
      await exportAgents();
      toast({ title: 'Export', description: 'Agents exported successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to export agents', variant: 'destructive' });
    }
  };

  const onAssign = async (ids: string[]) => {
    if (selected && ids[0]) {
      try {
        await assignAgent(selected.id, ids[0]);
        toast({ title: 'Assignment', description: 'Agent assigned successfully' });
        setShowAssign(false);
        load();
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to assign agent', variant: 'destructive' });
      }
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

      <SafeDataRenderer
        data={filteredAgents}
        loading={isLoading}
        error={error}
        onRetry={load}
        emptyTitle="No agents found"
        emptyDescription="Add agents to get started"
      >
        {(agents) => (
          <div className="overflow-x-auto glass-card">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2">{t('agents.agent_name')}</th>
                  <th className="px-4 py-2">{t('agents.mobile')}</th>
                  <th className="px-4 py-2">{t('agents.role')}</th>
                  <th className="px-4 py-2">Committee</th>
                  <th className="px-4 py-2">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {agents.map(a => (
                  <tr key={a.id} className="border-t border-white/10 hover:bg-accent/5 transition-colors">
                    <td className="px-4 py-3 font-medium">{a.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.mobile}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {a.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{a.committee_name || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleView(a)} className="hover:bg-primary/10">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(a)} className="hover:bg-secondary/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleAssign(a)} className="hover:bg-accent/10">
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-destructive hover:bg-destructive/10" 
                          onClick={() => handleDelete(a.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SafeDataRenderer>

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
