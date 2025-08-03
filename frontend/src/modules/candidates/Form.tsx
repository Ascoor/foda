import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { CandidateFormData } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const schema = z.object({
  name: z.string().min(1),
  party: z.string().min(1),
  type: z.enum(['individual', 'list']),
  status: z.enum(['active', 'withdrawn']),
});

interface Props {
  defaultValues?: CandidateFormData;
  onSubmit: (data: CandidateFormData) => void;
  onCancel?: () => void;
}

export const CandidateForm = ({ defaultValues, onSubmit, onCancel }: Props) => {
  const { t } = useTranslation();
  const form = useForm<CandidateFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <Input
          placeholder={t('candidates.candidate_name')}
          {...form.register('name')}
          className="glass"
        />
        {form.formState.errors.name && (
          <p className="text-destructive text-sm">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Input
          placeholder={t('candidates.party')}
          {...form.register('party')}
          className="glass"
        />
        {form.formState.errors.party && (
          <p className="text-destructive text-sm">
            {form.formState.errors.party.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select
            defaultValue={form.watch('type')}
            onValueChange={(val) => form.setValue('type', val as CandidateFormData['type'])}
          >
            <SelectTrigger className="glass">
              <SelectValue placeholder={t('common.type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">{t('candidates.types.individual')}</SelectItem>
              <SelectItem value="list">{t('candidates.types.list')}</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-destructive text-sm">
              {form.formState.errors.type.message}
            </p>
          )}
        </div>
        <div>
          <Select
            defaultValue={form.watch('status')}
            onValueChange={(val) => form.setValue('status', val as CandidateFormData['status'])}
          >
            <SelectTrigger className="glass">
              <SelectValue placeholder={t('common.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t('candidates.status_options.active')}</SelectItem>
              <SelectItem value="withdrawn">{t('candidates.status_options.withdrawn')}</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.status && (
            <p className="text-destructive text-sm">
              {form.formState.errors.status.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="glass-button bg-gradient-primary text-white">
          {t('common.save')}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="glass-button">
            {t('common.cancel')}
          </Button>
        )}
      </div>
    </form>
  );
};
