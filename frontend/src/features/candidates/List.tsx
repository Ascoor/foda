import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Candidate, CandidateFormData } from './types';
import { fetchCandidates, deleteCandidate, createCandidate, updateCandidate } from './api';
import { CandidateForm } from './Form';

export const CandidatesList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Candidate | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['candidates', page, search, typeFilter, statusFilter],
    queryFn: () =>
      fetchCandidates({
        page,
        per_page: 10,
        search,
        type: (typeFilter as "list" | "individual") || undefined,
        status: (statusFilter as "active" | "withdrawn") || undefined,
      }),
    placeholderData: (prevData) => prevData,
  });

  const candidates: Candidate[] = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 10) || 1;

  const deleteMutation = useMutation({
    mutationFn: deleteCandidate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['candidates'] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gradient-primary">{t('candidates.title')}</h1>
        <Button
          className="glass-button bg-gradient-primary text-white"
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
        >
          {t('candidates.add_candidate')}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder={t('common.search') || 'Search'}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="glass max-w-sm"
        />
        <Select
          value={typeFilter}
          onValueChange={(val) => {
            setTypeFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="glass max-w-xs">
            <SelectValue placeholder={t('common.type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">{t('candidates.types.individual')}</SelectItem>
            <SelectItem value="list">{t('candidates.types.list')}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="glass max-w-xs">
            <SelectValue placeholder={t('common.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">{t('candidates.status_options.active')}</SelectItem>
            <SelectItem value="withdrawn">{t('candidates.status_options.withdrawn')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">{t('candidates.candidate_name')}</th>
              <th className="px-4 py-2 text-left">{t('candidates.party')}</th>
              <th className="px-4 py-2 text-left">{t('common.type')}</th>
              <th className="px-4 py-2 text-left">{t('common.status')}</th>
              <th className="px-4 py-2 text-left">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id} className="border-t border-white/10">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.party}</td>
                <td className="px-4 py-2">{t(`candidates.types.${c.type}`)}</td>
                <td className="px-4 py-2">{t(`candidates.status_options.${c.status}`)}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/candidates/${c.id}`)}>
                    {t('common.view')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelected(c);
                      setShowForm(true);
                    }}
                  >
                    {t('common.edit')}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(c.id)}
                  >
                    {t('common.delete')}
                  </Button>
                </td>
              </tr>
            ))}
            {candidates.length === 0 && !isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-muted-foreground">
                  {t('common.no_data')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          {t('common.previous')}
        </Button>
        <span>
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          {t('common.next')}
        </Button>
      </div>

      {showForm && (
        <div className="glass-card p-4">
          <CandidateForm
            defaultValues={selected || undefined}
            onSubmit={async (formData: CandidateFormData) => {
              if (selected) {
                await updateCandidate(selected.id, formData);
              } else {
                await createCandidate(formData);
              }
              setShowForm(false);
              queryClient.invalidateQueries({ queryKey: ['candidates'] });
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
};
