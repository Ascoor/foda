import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Eye, Edit, Trash2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssignDialog } from '@/components/ui/AssignDialog';
import { Volunteer, VolunteerFilters } from './types';
import { fetchVolunteers, deleteVolunteer, assignVolunteer, mockCommittees } from './api';
import { VolunteerForm } from './VolunteerForm';
import { VolunteerDetails } from './VolunteerDetails';

export const VolunteersList = () => {
  const { t } = useTranslation();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filters, setFilters] = useState<VolunteerFilters>({});
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selected, setSelected] = useState<Volunteer | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchVolunteers(filters);
    setVolunteers(data);
    setIsLoading(false);
  }, [filters]);

  useEffect(() => { load(); }, [load]);
  const filtered = volunteers.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => { setSelected(null); setShowForm(true); };
  const handleEdit = (v: Volunteer) => { setSelected(v); setShowForm(true); };
  const handleView = (v: Volunteer) => { setSelected(v); setShowDetails(true); };
  const handleAssign = (v: Volunteer) => { setSelected(v); setShowAssign(true); };

  const onAssign = async (ids: string[]) => {
    if (selected && ids[0]) {
      await assignVolunteer(selected.id, ids[0]);
      setShowAssign(false);
      load();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gradient-primary">{t('volunteers.title')}</h1>
        <Button onClick={handleAdd} className="bg-gradient-primary text-white">
          <Plus className="h-4 w-4 mr-2" />{t('volunteers.add_volunteer')}
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
            <SelectValue placeholder={t('volunteers.skills')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="logistics">Logistics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto glass-card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">{t('volunteers.volunteer_name')}</th>
              <th className="px-4 py-2">{t('volunteers.skills')}</th>
              <th className="px-4 py-2">{t('volunteers.assigned_area') || 'Committee'}</th>
              <th className="px-4 py-2">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id} className="border-t border-white/10">
                <td className="px-4 py-2">{v.name}</td>
                <td className="px-4 py-2">{v.role}</td>
                <td className="px-4 py-2">{v.committee_name || '-'}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleView(v)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(v)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleAssign(v)}>
                    <UserCheck className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteVolunteer(v.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-muted-foreground">
                  {t('common.no_data') || 'No data'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <VolunteerForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setSelected(null); }}
        onSuccess={() => { setShowForm(false); load(); }}
        volunteer={selected}
      />
      <VolunteerDetails
        isOpen={showDetails}
        onClose={() => { setShowDetails(false); setSelected(null); }}
        volunteer={selected}
        onEdit={v => { setShowDetails(false); handleEdit(v); }}
      />
      <AssignDialog
        isOpen={showAssign}
        onClose={() => setShowAssign(false)}
        title={t('volunteers.assigned_area') || 'Assign'}
        items={mockCommittees.map(c => ({ id: c.id, name: c.name }))}
        onAssign={onAssign}
        multiSelect={false}
      />
    </div>
  );
};
