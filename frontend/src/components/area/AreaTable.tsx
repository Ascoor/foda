/**
 * Searchable table of areas.
 * Legacy reference: old/application/modules/area/views/area.php
 * lists and manages areas via DataTables.
 *
 * Testing:
 * 1. Navigate to /areas.
 * 2. Use the search box to filter records.
 * 3. Edit/Delete actions should update the table without reload.
 */
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { Area } from '@/lib/areas';
import { useAreas, useDeleteArea } from '@/hooks/useAreas';

interface Props {
  onEdit: (area: Area) => void;
}

const AreaTable: React.FC<Props> = ({ onEdit }) => {
  const { direction, t } = useLanguage();
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAreas(search);
  const deleteArea = useDeleteArea();

  const areas: Area[] = data?.data ?? data ?? [];

  const remove = (id: number) => {
    if (!confirm(t('areas.confirm_delete'))) return;
    deleteArea.mutate(id);
  };

  if (isLoading) return <div className="p-6">{t('common.loading')}</div>;

  return (
    <div className="space-y-4">
      <Input
        placeholder={t('common.search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="glass w-full sm:w-1/2"
      />
      <Table>
        <TableHeader>
          <TableRow className={direction === 'rtl' ? 'text-right' : ''}>
            <TableHead>{t('areas.name')}</TableHead>
            <TableHead>{t('areas.description')}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas.map((area) => (
            <TableRow key={area.id} className={direction === 'rtl' ? 'text-right' : ''}>
              <TableCell>{area.name}</TableCell>
              <TableCell>{area.description}</TableCell>
              <TableCell>
                <div className={`flex gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Button size="sm" variant="outline" onClick={() => onEdit(area)}>
                    {t('common.edit')}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(area.id)}>
                    {t('common.delete')}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AreaTable;
