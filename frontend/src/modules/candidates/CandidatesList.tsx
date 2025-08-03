import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Candidate, CandidateFilters } from './types';
import { fetchCandidates, deleteCandidate } from './api';
import { CandidateForm } from './CandidateForm';
import { CandidateDetails } from './CandidateDetails';

export const CandidatesList = () => {
  const { t } = useTranslation();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filters, setFilters] = useState<CandidateFilters>({});
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selected, setSelected] = useState<Candidate | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchCandidates(filters);
    setCandidates(data);
    setIsLoading(false);
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => { setSelected(null); setShowForm(true); };
  const handleEdit = (c: Candidate) => { setSelected(c); setShowForm(true); };
  const handleView = (c: Candidate) => { setSelected(c); setShowDetails(true); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gradient-primary">{t('candidates.title')}</h1>
        <Button onClick={handleAdd} className="bg-gradient-primary text-white">
          <Plus className="h-4 w-4 mr-2" />{t('candidates.add_candidate')}
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
        <Select onValueChange={(v: 'individual' | 'list') => setFilters(f => ({ ...f, type: v }))}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t('common.type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">{t('candidates.types.individual')}</SelectItem>
            <SelectItem value="list">{t('candidates.types.list')}</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(v: 'active' | 'withdrawn') => setFilters(f => ({ ...f, status: v }))}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t('common.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto glass-card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">{t('candidates.candidate_name')}</th>
              <th className="px-4 py-2">{t('candidates.party')}</th>
              <th className="px-4 py-2">{t('common.type')}</th>
              <th className="px-4 py-2">{t('common.status')}</th>
              <th className="px-4 py-2">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-t border-white/10">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.party}</td>
                <td className="px-4 py-2">{t(`candidates.types.${c.type}`)}</td>
                <td className="px-4 py-2">{c.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleView(c)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(c)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteCandidate(c.id)}>
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

      <CandidateForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setSelected(null); }}
        onSuccess={() => { setShowForm(false); load(); }}
        candidate={selected}
      />
      <CandidateDetails
        isOpen={showDetails}
        onClose={() => { setShowDetails(false); setSelected(null); }}
        candidate={selected}
        onEdit={c => { setShowDetails(false); handleEdit(c); }}
      />
    </div>
  );
};
