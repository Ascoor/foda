import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  fetchFinances,
  createFinance,
  updateFinance,
  deleteFinance,
  FinancePayload,
} from '@/lib/finances';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Finance extends FinancePayload {
  id: number;
}

const schema = z.object({
  amount: z.number().min(0),
  type: z.enum(['income', 'expense']),
  date: z.string().min(1),
  description: z.string().optional(),
  reference_id: z.number().optional(),
});

export const Finance: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [finances, setFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Finance | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FinancePayload>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'income' },
  });

  const loadData = useCallback(() => {
    setLoading(true);
    fetchFinances()
      .then((data) => setFinances(data.data ?? data))
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (editing) {
        await updateFinance(editing.id, data);
      } else {
        await createFinance(data);
      }
      setOpen(false);
      setEditing(null);
      reset({ type: 'income' });
      loadData();
    } catch {
      setError(t('common.error'));
    }
  });

  const startCreate = () => {
    setEditing(null);
    reset({ type: 'income' });
    setOpen(true);
  };

  const startEdit = (finance: Finance) => {
    setEditing(finance);
    reset({
      amount: finance.amount,
      type: finance.type,
      date: finance.date,
      description: finance.description ?? '',
      reference_id: finance.reference_id,
    });
    setOpen(true);
  };

  const handleDelete = async (finance: Finance) => {
    if (confirm(t('finance.delete'))) {
      await deleteFinance(finance.id);
      loadData();
    }
  };

  if (loading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
          {t('finance.title')}
        </h1>
        <Button onClick={startCreate}>{t('finance.add')}</Button>
      </div>

      {finances.length === 0 ? (
        <div>{t('finance.no_records')}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('finance.amount')}</TableHead>
              <TableHead>{t('finance.type')}</TableHead>
              <TableHead>{t('finance.date')}</TableHead>
              <TableHead>{t('finance.description')}</TableHead>
              <TableHead>{t('finance.reference')}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {finances.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.amount}</TableCell>
                <TableCell>{t(`finance.${f.type}`)}</TableCell>
                <TableCell>{f.date}</TableCell>
                <TableCell>{f.description}</TableCell>
                <TableCell>{f.reference_id ?? ''}</TableCell>
                <TableCell>
                  <div className={`flex gap-2 justify-end ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Button variant="outline" size="sm" onClick={() => startEdit(f)}>
                      {t('common.edit')}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(f)}>
                      {t('common.delete')}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? t('finance.edit') : t('finance.add')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label>{t('finance.amount')}</Label>
              <Input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message as string}</p>
              )}
            </div>
            <div>
              <Label>{t('finance.type')}</Label>
              <Select
                value={watch('type')}
                onValueChange={(v) => setValue('type', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">{t('finance.income')}</SelectItem>
                  <SelectItem value="expense">{t('finance.expense')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message as string}</p>
              )}
            </div>
            <div>
              <Label>{t('finance.date')}</Label>
              <Input type="date" {...register('date')} />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message as string}</p>
              )}
            </div>
            <div>
              <Label>{t('finance.description')}</Label>
              <Input {...register('description')} />
            </div>
            <div>
              <Label>{t('finance.reference')}</Label>
              <Input type="number" {...register('reference_id', { valueAsNumber: true })} />
            </div>
            <DialogFooter className={`flex ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{t('common.save')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Finance;

