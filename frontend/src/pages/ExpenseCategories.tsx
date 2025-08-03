import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  FinanceCategory,
} from '@/lib/finances';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Plus } from 'lucide-react';

const ExpenseCategories: React.FC = () => {
  const { t, direction, language } = useLanguage();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['expense-categories'],
    queryFn: fetchCategories,
  });
  const categories: FinanceCategory[] = data?.data ?? data ?? [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FinanceCategory | null>(null);
  const [name, setName] = useState('');

  const saveMutation = useMutation({
    mutationFn: () =>
      editing
        ? updateCategory(editing.id, { name })
        : createCategory({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expense-categories'] }),
  });

  const startCreate = () => {
    setEditing(null);
    setName('');
    setOpen(true);
  };

  const startEdit = (cat: FinanceCategory) => {
    setEditing(cat);
    setName(cat.name);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm(t('common.confirm_delete'))) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  if (isLoading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">{(error as Error).message}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
          {t('finance.categories')}
        </h1>
        <Button onClick={startCreate} className="transition-glow hover:neon-glow-orange">
          <Plus className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
          <span className={language === 'ar' ? 'font-arabic' : ''}>{t('finance.add_category')}</span>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className={direction === 'rtl' ? 'text-right' : ''}>
            <TableHead>{t('common.name')}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id} className={direction === 'rtl' ? 'text-right' : ''}>
              <TableCell>{cat.name}</TableCell>
              <TableCell className="text-right">
                <div className={`flex gap-2 justify-end ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Button size="sm" variant="outline" onClick={() => startEdit(cat)}>
                    {t('common.edit')}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}>
                    {t('common.delete')}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
              {editing ? t('finance.edit_category') : t('finance.add_category')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
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

export default ExpenseCategories;
