import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchFinancialReport } from '@/lib/finances';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';

interface ReportItem {
  id: number;
  date: string;
  type: string;
  amount: number;
  description?: string;
}

const FinancialReport: React.FC = () => {
  const { t, direction, language } = useLanguage();
  const [filters, setFilters] = useState({ from: '', to: '' });

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['financial-report', filters],
    queryFn: () => fetchFinancialReport(filters),
    enabled: false,
  });

  const records: ReportItem[] = data?.data ?? data ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
        {t('finance.report')}
      </h1>

      <form onSubmit={handleSubmit} className={`flex gap-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <Input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />
        <Input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />
        <Button type="submit" disabled={isFetching}>
          {t('finance.generate_report')}
        </Button>
      </form>

      {isFetching && <div>{t('common.loading')}</div>}
      {error && <div className="text-red-500">{(error as Error).message}</div>}

      {records.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className={direction === 'rtl' ? 'text-right' : ''}>
              <TableHead>{t('finance.date')}</TableHead>
              <TableHead>{t('finance.type')}</TableHead>
              <TableHead>{t('finance.amount')}</TableHead>
              <TableHead>{t('finance.description')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r) => (
              <TableRow key={r.id} className={direction === 'rtl' ? 'text-right' : ''}>
                <TableCell>{r.date}</TableCell>
                <TableCell>{t(`finance.${r.type}`)}</TableCell>
                <TableCell>{r.amount}</TableCell>
                <TableCell>{r.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default FinancialReport;
