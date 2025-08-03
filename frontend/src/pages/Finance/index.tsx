/**
 * FinancePage
 * Legacy: none
 * Usage: manage finance transactions (create, edit, delete) with categories.
 * Test: run `npm run lint` and navigate to /finance to verify CRUD flows.
 */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  fetchFinances,
  createFinance,
  updateFinance,
  deleteFinance,
  fetchCategories,
  FinancePayload,
  FinanceCategory,
} from '@/lib/finances';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  category?: FinanceCategory;
}

const schema = z.object({
  amount: z.number().min(0),
  type: z.enum(['income', 'expense']),
  date: z.string().min(1),
  description: z.string().optional(),
  reference_id: z.number().optional(),
  category_id: z.number(),
});

const FinancePage: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Finance | null>(null);

  const { data: financeData, isLoading, isError } = useQuery({
    queryKey: ['finances'],
    queryFn: fetchFinances,
  });
  const finances: Finance[] = financeData?.data ?? financeData ?? [];

  const { data: categoryData } = useQuery({
    queryKey: ['expense-categories'],
    queryFn: fetchCategories,
  });
  const categories: FinanceCategory[] = categoryData?.data ?? categoryData ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FinancePayload>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'income', category_id: 0 },
  });

  // ensure default category when categories loaded
  useEffect(() => {
    if (categories.length > 0 && !watch('category_id')) {
      setValue('category_id', categories[0].id);
    }
  }, [categories, setValue, watch]);

  const saveMutation = useMutation({
    mutationFn: (data: FinancePayload) =>
      editing ? updateFinance(editing.id, data) : createFinance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
      setOpen(false);
      setEditing(null);
      reset({ type: 'income', category_id: categories[0]?.id ?? 0 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFinance(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['finances'] }),
  });

  const onSubmit = handleSubmit((data) => saveMutation.mutate(data));

  const startCreate = () => {
    setEditing(null);
    reset({ type: 'income', category_id: categories[0]?.id ?? 0 });
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
      category_id: finance.category_id,
    });
    setOpen(true);
  };

  const handleDelete = (finance: Finance) => {
    if (confirm(t('finance.delete'))) {
      deleteMutation.mutate(finance.id);
    }
  };

  if (isLoading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">{t('common.error')}</div>;
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
              <TableHead>{t('finance.category')}</TableHead>
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
                <TableCell>{f.category?.name}</TableCell>
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
              <Select value={watch('type')} onValueChange={(v: 'income' | 'expense') => setValue('type', v)}>
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
              <Label>{t('finance.category')}</Label>
              <Select value={String(watch('category_id'))} onValueChange={(v) => setValue('category_id', Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-red-500 text-sm">{errors.category_id.message as string}</p>
              )}
            </div>
            <div>
              <Label>{t('finance.reference')}</Label>
              <Input type="number" {...register('reference_id', { valueAsNumber: true })} />
            </div>
            <DialogFooter className={`flex ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={saveMutation.isLoading}>
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePage;
