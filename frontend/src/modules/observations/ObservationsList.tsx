import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableSkeleton, EmptyState } from '@/components/ui/DataTableSkeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Observation, ObservationFilters } from './types';
import { fetchObservations, deleteObservation, mockCommittees } from './api';
import { ObservationForm } from './ObservationForm';
import { ObservationDetails } from './ObservationDetails';

function safeArray<T = any>(arr: any): T[] {
  return Array.isArray(arr) ? arr : [];
}
export const ObservationsList = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<Observation[]>([]);
  const [filters, setFilters] = useState<ObservationFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selected, setSelected] = useState<Observation | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchObservations(filters);
    setItems(data);
    setIsLoading(false);
  }, [filters]);

  useEffect(() => { load(); }, [load]);
 
  const handleAdd = () => { setSelected(null); setShowForm(true); };
  const handleEdit = (o: Observation) => { setSelected(o); setShowForm(true); };
  const handleView = (o: Observation) => { setSelected(o); setShowDetails(true); };

  // حماية من undefined/null
  const filtered = safeArray(items);

  // --- حالات التحميل، الخطأ، لا توجد بيانات ---
  if (isLoading) {
    return <DataTableSkeleton rows={5} columns={5} />;
  }
  if (isError) {
    return (
      <div className="glass-card p-8 flex flex-col items-center gap-4">
        <div className="text-destructive text-lg font-bold">
          {t('common.error_loading_data') || "Error loading data"}
        </div>
        <Button onClick={load} className="glass-button bg-gradient-primary text-white">
          {t('common.retry') || "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gradient-primary">{t('observations.title')}</h1>
        <Button onClick={handleAdd} className="bg-gradient-primary text-white">
          <Plus className="h-4 w-4 mr-2" />{t('observations.add_observation')}
        </Button>
      </div>

      <div className="flex gap-2">
        <Select onValueChange={(v) => setFilters((f) => ({ ...f, type: v }))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('observations.observation_type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="violation">{t('observations.types.violation')}</SelectItem>
            <SelectItem value="note">{t('observations.types.note')}</SelectItem>
            <SelectItem value="complaint">{t('observations.types.complaint')}</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => setFilters((f) => ({ ...f, committee_id: v }))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('observations.committee')} />
          </SelectTrigger>
          <SelectContent>
            {safeArray(mockCommittees).map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto glass-card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">{t('observations.observer')}</th>
              <th className="px-4 py-2">{t('observations.observation_type')}</th>
              <th className="px-4 py-2">{t('observations.committee')}</th>
              <th className="px-4 py-2">{t('observations.timestamp')}</th>
              <th className="px-4 py-2">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted-foreground">
                  <EmptyState
                    title={t('common.no_data')}
                    description={t('observations.no_observations') || ""}
                  />
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} className="border-t border-white/10">
                  <td className="px-4 py-2">{o.observer || '-'}</td>
                  <td className="px-4 py-2">{t(`observations.types.${o.type}`)}</td>
                  <td className="px-4 py-2">{o.committee_name || '-'}</td>
                  <td className="px-4 py-2">{o.timestamp ? new Date(o.timestamp).toLocaleString() : '-'}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => handleView(o)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(o)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteObservation(o.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ObservationForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setSelected(null); }}
        onSuccess={() => { setShowForm(false); load(); }}
        observation={selected}
      />
      <ObservationDetails
        isOpen={showDetails}
        onClose={() => { setShowDetails(false); setSelected(null); }}
        observation={selected}
        onEdit={(o) => { setShowDetails(false); handleEdit(o); }}
      />
    </div>
  );
};