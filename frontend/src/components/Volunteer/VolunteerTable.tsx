/**
 * Volunteer table extracted from legacy view old/application/modules/volunteer/views/volunteer.php
 * Test: render with sample data; check edit/delete callbacks fire.
 */
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface Volunteer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  team?: { id: number | null; name: string | null };
}

type Props = {
  data: Volunteer[];
  onEdit: (v: Volunteer) => void;
  onDelete: (id: number) => void;
};

export const VolunteerTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const { t, direction } = useLanguage();
  return (
    <Table>
      <TableHeader>
        <TableRow className={direction === 'rtl' ? 'text-right' : ''}>
          <TableHead>{t('volunteers.name')}</TableHead>
          <TableHead>{t('volunteers.email')}</TableHead>
          <TableHead>{t('volunteers.phone')}</TableHead>
          <TableHead>{t('volunteers.team')}</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((vol) => (
          <TableRow key={vol.id} className={direction === 'rtl' ? 'text-right' : ''}>
            <TableCell>{vol.name}</TableCell>
            <TableCell>{vol.email}</TableCell>
            <TableCell>{vol.phone}</TableCell>
            <TableCell>{vol.team?.name}</TableCell>
            <TableCell>
              <div className={`flex gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Button size="sm" variant="outline" onClick={() => onEdit(vol)}>
                  {t('common.edit')}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(vol.id)}>
                  {t('common.delete')}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
