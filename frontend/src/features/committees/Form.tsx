import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { CommitteeFormData, GeoArea } from './types';
import { fetchGeoAreas } from './api';
import { useQuery } from '@tanstack/react-query';
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
  location: z.string().min(1),
  geo_area_id: z.string().min(1),
});

interface Props {
  defaultValues?: CommitteeFormData;
  onSubmit: (data: CommitteeFormData) => void;
  onCancel?: () => void;
}

export const CommitteeForm = ({ defaultValues, onSubmit, onCancel }: Props) => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const form = useForm<CommitteeFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { data: areas } = useQuery<{ data: GeoArea[] }>({
    queryKey: ['geo-areas'],
    queryFn: fetchGeoAreas,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <Input
          placeholder={t('committees.committee_name')}
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
          placeholder={t('committees.location')}
          {...form.register('location')}
          className="glass"
        />
        {form.formState.errors.location && (
          <p className="text-destructive text-sm">
            {form.formState.errors.location.message}
          </p>
        )}
      </div>

      <div>
        <Select
          defaultValue={form.watch('geo_area_id')}
          onValueChange={(val) => form.setValue('geo_area_id', val)}
        >
          <SelectTrigger className="glass">
            <SelectValue placeholder={t('committees.area')} />
          </SelectTrigger>
          <SelectContent>
            {areas?.data?.map((area: GeoArea) => (
              <SelectItem key={area.id} value={String(area.id)}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.geo_area_id && (
          <p className="text-destructive text-sm">
            {form.formState.errors.geo_area_id.message}
          </p>
        )}
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
