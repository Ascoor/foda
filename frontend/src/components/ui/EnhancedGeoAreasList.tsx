import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Plus, Search, Filter, Download, 
  Edit, Trash2, Eye, Users, Building 
} from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { SafeDataRenderer } from './SafeDataRenderer';
import { fetchGeoAreas, deleteGeoArea } from '@/modules/geo-areas/api';
import { GeoArea } from '@/modules/geo-areas/types';
import { safeArray, safeNumber } from '@/lib/safeData';
import { toast } from '@/hooks/use-toast';

const GeoAreaCard = ({ 
  area, 
  onEdit, 
  onDelete, 
  onView 
}: { 
  area: GeoArea; 
  onEdit: (area: GeoArea) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}) => {
  const { t } = useTranslation();
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'governorate': return 'primary';
      case 'district': return 'secondary';
      case 'city': return 'accent';
      case 'village': return 'success';
      default: return 'muted';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'governorate': return Building;
      case 'district': return Building;
      case 'city': return MapPin;
      case 'village': return MapPin;
      default: return MapPin;
    }
  };
  
  const TypeIcon = getTypeIcon(area.type);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="glass-card group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`
            p-2 rounded-lg bg-gradient-to-br 
            from-${getTypeColor(area.type)} to-${getTypeColor(area.type)}-glow
            text-white shadow-lg
          `}>
            <TypeIcon size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{area.name}</h3>
            <Badge variant="secondary" className="glass text-xs">
              {t(`geo_areas.types.${area.type}`)}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {area.parent_name && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{t('geo_areas.parent')}:</span> {area.parent_name}
          </p>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('geo_areas.total_voters')}:</span>
          <span className="font-medium">{safeNumber(area.total_voters).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('geo_areas.total_committees')}:</span>
          <span className="font-medium">{safeNumber(area.total_committees).toLocaleString()}</span>
        </div>
        {area.children_count !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('geo_areas.children_count')}:</span>
            <span className="font-medium">{safeNumber(area.children_count).toLocaleString()}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t border-white/10">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onView(area.id)}
          className="glass-button flex-1 mr-1"
        >
          <Eye size={14} className="mr-1" />
          {t('common.view')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(area)}
          className="glass-button flex-1 mx-1"
        >
          <Edit size={14} className="mr-1" />
          {t('common.edit')}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(area.id)}
          className="glass-button flex-1 ml-1"
        >
          <Trash2 size={14} className="mr-1" />
          {t('common.delete')}
        </Button>
      </div>
    </motion.div>
  );
};

export const EnhancedGeoAreasList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { 
    data: geoAreas, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['geo-areas'],
    queryFn: fetchGeoAreas,
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteGeoArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geo-areas'] });
      toast({ description: t('geo_areas.delete_success') });
    },
    onError: () => {
      toast({ 
        variant: 'destructive', 
        description: t('geo_areas.delete_error') 
      });
    }
  });
  
  const filteredAreas = safeArray(geoAreas).filter(area => {
    const matchesSearch = area.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || area.type === typeFilter;
    return matchesSearch && matchesType;
  });
  
  const handleExport = () => {
    const headers = ['Name', 'Type', 'Parent', 'Voters', 'Committees'];
    const rows = filteredAreas.map(area => [
      area.name,
      area.type,
      area.parent_name || '',
      area.total_voters.toString(),
      area.total_committees.toString()
    ]);
    
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geo-areas.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const typeOptions = ['governorate', 'district', 'city', 'village'];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary mb-2">
              {t('geo_areas.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('geo_areas.description')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              className="glass-button"
            >
              <Download size={16} className="mr-2" />
              {t('common.export')}
            </Button>
            <Button
              onClick={() => navigate('/geo-areas/new')}
              className="glass-button bg-gradient-primary text-white"
            >
              <Plus size={16} className="mr-2" />
              {t('geo_areas.add_area')}
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('geo_areas.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="glass w-full sm:w-48">
              <SelectValue placeholder={t('geo_areas.filter_by_type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('common.all')}</SelectItem>
              {typeOptions.map(type => (
                <SelectItem key={type} value={type}>
                  {t(`geo_areas.types.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="glass-button"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="glass-button"
            >
              List
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
          {typeOptions.map(type => {
            const count = filteredAreas.filter(area => area.type === type).length;
            return (
              <div key={type} className="text-center">
                <div className="text-2xl font-bold text-primary">{count}</div>
                <div className="text-xs text-muted-foreground">
                  {t(`geo_areas.types.${type}`)}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Content */}
      <SafeDataRenderer
        data={filteredAreas}
        loading={isLoading}
        error={error}
        loadingMessage={t('geo_areas.loading')}
        emptyTitle={t('geo_areas.no_areas_found')}
        emptyDescription={t('geo_areas.try_different_filters')}
        emptyAction={
          <Button onClick={() => navigate('/geo-areas/new')} className="glass-button">
            <Plus size={16} className="mr-2" />
            {t('geo_areas.add_first_area')}
          </Button>
        }
      >
        {(areas) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {areas.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GeoAreaCard
                  area={area}
                  onEdit={(area) => navigate(`/geo-areas/${area.id}/edit`)}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  onView={(id) => navigate(`/geo-areas/${id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </SafeDataRenderer>
    </div>
  );
};