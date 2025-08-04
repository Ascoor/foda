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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DataTableSkeleton, EmptyState } from '@/components/ui/DataTableSkeleton';
import { safeArray } from '@/lib/utils';
import { Voter, VoterFormData } from './types';
import { fetchVoters, deleteVoter, createVoter, updateVoter } from './api';
import { VoterForm } from './Form';

export const VotersList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Voter | null>(null);

  const {
    data = { data: [], total: 0 },
    isLoading,
    error,
  } = useQuery<{ data: Voter[]; total: number }>({
    queryKey: ['voters', page, search, genderFilter],
    queryFn: () =>
      fetchVoters({
        page,
        per_page: 10,
        search,
        gender: (genderFilter as "male" | "female") || undefined,
      }),
    placeholderData: (prevData) => prevData,
  });

  const voters = safeArray(data.data);
  const total = data.total ?? 0;
  const totalPages = Math.ceil(total / 10) || 1;

  const deleteMutation = useMutation({
    mutationFn: deleteVoter,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['voters'] }),
  });

  if (isLoading) return <DataTableSkeleton />;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t('common.error') || 'Error'}</AlertTitle>
        <AlertDescription>{(error as Error).message}</AlertDescription>
      </Alert>
    );
  }

  if (voters.length === 0) {
    return <EmptyState title={t('common.no_data')} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gradient-primary">{t('voters.title')}</h1>
        <Button
          className="glass-button bg-gradient-primary text-white"
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
        >
          {t('voters.add_voter')}
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
          value={genderFilter}
          onValueChange={(val) => {
            setGenderFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="glass max-w-xs">
            <SelectValue placeholder={t('voters.gender')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">{t('voters.gender_options.male')}</SelectItem>
            <SelectItem value="female">{t('voters.gender_options.female')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">{t('voters.full_name')}</th>
              <th className="px-4 py-2 text-left">{t('voters.national_id')}</th>
              <th className="px-4 py-2 text-left">{t('voters.gender')}</th>
              <th className="px-4 py-2 text-left">{t('voters.phone')}</th>
              <th className="px-4 py-2 text-left">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((v) => (
              <tr key={v.id} className="border-t border-white/10">
                <td className="px-4 py-2">{v.full_name}</td>
                <td className="px-4 py-2">{v.national_id}</td>
                <td className="px-4 py-2">{t(`voters.gender_options.${v.gender}`)}</td>
                <td className="px-4 py-2">{v.mobile}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/voters/${v.id}`)}>
                    {t('common.view')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelected(v);
                      setShowForm(true);
                    }}
                  >
                    {t('common.edit')}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(v.id)}
                  >
                    {t('common.delete')}
                  </Button>
                </td>
              </tr>
            ))}
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
          <VoterForm
            defaultValues={selected || undefined}
            onSubmit={async (formData: VoterFormData) => {
              if (selected) {
                await updateVoter(selected.id, formData);
              } else {
                await createVoter(formData);
              }
              setShowForm(false);
              queryClient.invalidateQueries({ queryKey: ['voters'] });
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
};
