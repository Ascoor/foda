import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { MapPin, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { GeoArea, GeoAreaFormData } from './types';
import { createGeoArea, updateGeoArea } from './api';

interface GeoAreaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  area?: GeoArea | null;
  parentAreas: GeoArea[];
}

const areaTypes = ['governorate', 'district', 'city', 'village'] as const;

export const GeoAreaForm = ({
  isOpen,
  onClose,
  onSuccess,
  area,
  parentAreas
}: GeoAreaFormProps) => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<GeoAreaFormData>({
    defaultValues: {
      name: '',
      parent_id: null,
      type: 'city'
    }
  });

  const selectedType = watch('type');
  const selectedParentId = watch('parent_id');

  // Filter available parent areas based on hierarchy
  const getAvailableParents = () => {
    if (selectedType === 'governorate') return [];
    if (selectedType === 'district') {
      return parentAreas.filter(p => p.type === 'governorate');
    }
    if (selectedType === 'city') {
      return parentAreas.filter(p => p.type === 'governorate' || p.type === 'district');
    }
    if (selectedType === 'village') {
      return parentAreas.filter(p => p.type === 'city' || p.type === 'district');
    }
    return parentAreas;
  };

  useEffect(() => {
    if (area) {
      // Edit mode
      setValue('name', area.name);
      setValue('parent_id', area.parent_id);
      setValue('type', area.type);
    } else {
      // Add mode
      reset();
    }
  }, [area, setValue, reset]);

  const onSubmit = async (data: GeoAreaFormData) => {
    try {
      setIsSubmitting(true);
      
      if (area) {
        await updateGeoArea(area.id, data);
      } else {
        await createGeoArea(data);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Failed to save geo area:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient-primary flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {area ? t('common.edit') : t('geo_areas.add_area')}
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Area Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {t('geo_areas.area_name')} *
            </Label>
            <Input
              id="name"
              {...register('name', { 
                required: 'Area name is required',
                minLength: { value: 2, message: 'Area name must be at least 2 characters' }
              })}
              placeholder={t('geo_areas.area_name')}
              className="glass border-white/20"
              dir={direction}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive text-xs"
              >
                {errors.name.message}
              </motion.p>
            )}
          </div>

          {/* Area Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t('geo_areas.area_type')} *
            </Label>
            <Select
              value={selectedType}
              onValueChange={(value) => {
                setValue('type', value as any);
                // Reset parent selection when type changes
                setValue('parent_id', null);
              }}
            >
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder={t('geo_areas.area_type')} />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20 bg-background/95 backdrop-blur-md z-50">
                {areaTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`geo_areas.types.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Parent Area */}
          {getAvailableParents().length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t('geo_areas.parent_area')}
                {selectedType !== 'governorate' && ' *'}
              </Label>
              <Select
                value={selectedParentId || ''}
                onValueChange={(value) => setValue('parent_id', value || null)}
              >
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder={t('geo_areas.parent_area')} />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20 bg-background/95 backdrop-blur-md z-50">
                  {getAvailableParents().map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name} ({t(`geo_areas.types.${parent.type}`)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Hierarchy Info */}
          {selectedType && getAvailableParents().length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 bg-primary/5 rounded-lg border border-primary/20"
            >
              <p className="text-xs text-muted-foreground">
                <strong>Hierarchy:</strong> {t(`geo_areas.types.${selectedType}`)} 
                {selectedType !== 'governorate' && ' requires a parent area'}
              </p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 glass-button"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-primary text-white shadow-glow disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('common.save')
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};