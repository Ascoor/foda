import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  MapPin,
  Users,
  Building,
  Edit,
  Trash2,
  Eye,
  TreePine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTableSkeleton, EmptyState } from '@/components/ui/DataTableSkeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { GeoArea } from './types';
import { fetchGeoAreas } from './api';
import { GeoAreaForm } from './Form';

const typeIcons = {
  governorate: Building,
  district: MapPin,
  city: Building,
  village: TreePine
};

const typeColors = {
  governorate: 'bg-primary/10 text-primary border-primary/20',
  district: 'bg-secondary/10 text-secondary border-secondary/20',
  city: 'bg-accent/10 text-accent border-accent/20',
  village: 'bg-muted/50 text-muted-foreground border-muted'
};

export const GeoAreasList = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [geoAreas, setGeoAreas] = useState<GeoArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedArea, setSelectedArea] = useState<GeoArea | null>(null);

  useEffect(() => {
    loadGeoAreas();
  }, []);

  const loadGeoAreas = async () => {
    try {
      setIsLoading(true);
      const areas = await fetchGeoAreas();
      setGeoAreas(areas);
    } catch (error) {
      console.error('Failed to load geo areas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAreas = geoAreas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (area.parent_name && area.parent_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddArea = () => {
    setSelectedArea(null);
    setShowForm(true);
  };

  const handleEditArea = (area: GeoArea) => {
    setSelectedArea(area);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedArea(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    loadGeoAreas(); // Reload data
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">
              {t('geo_areas.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage geographic areas and administrative divisions
            </p>
          </div>
          
          <Button 
            onClick={handleAddArea}
            className="glass-button bg-gradient-primary text-white shadow-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('geo_areas.add_area')}
          </Button>
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
            <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${direction === 'rtl' ? 'right-3' : 'left-3'}`} />
            <Input
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`glass border-white/20 ${direction === 'rtl' ? 'pr-10' : 'pl-10'}`}
            />
          </div>
          
          <Button variant="outline" className="glass-button">
            <Filter className="h-4 w-4 mr-2" />
            {t('common.filter')}
          </Button>
        </div>
      </motion.div>

      {/* Areas Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('geo_areas.area_name')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('geo_areas.area_type')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('geo_areas.parent_area')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('geo_areas.total_voters')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('geo_areas.total_committees')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-6">
                      <DataTableSkeleton rows={5} columns={6} />
                    </td>
                  </tr>
                ) : filteredAreas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6">
                      <EmptyState
                        title="No geographic areas found"
                        description="Get started by creating your first geographic area"
                        icon={<MapPin className="h-8 w-8 text-muted-foreground" />}
                        action={
                          <Button 
                            onClick={handleAddArea}
                            className="glass-button bg-gradient-primary text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('geo_areas.add_area')}
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  filteredAreas.map((area, index) => {
                    const TypeIcon = typeIcons[area.type];
                    
                    return (
                      <motion.tr
                        key={area.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors group"
                      >
                        {/* Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                              <TypeIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {area.name}
                              </div>
                              {area.children_count && area.children_count > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  {area.children_count} sub-areas
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-6 py-4">
                          <StatusBadge 
                            status={t(`geo_areas.types.${area.type}`)} 
                            className={typeColors[area.type]}
                          />
                        </td>

                        {/* Parent */}
                        <td className="px-6 py-4">
                          {area.parent_name ? (
                            <div className="text-sm text-muted-foreground">
                              {area.parent_name}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Root
                            </Badge>
                          )}
                        </td>

                        {/* Voters */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                              {area.total_voters.toLocaleString()}
                            </span>
                          </div>
                        </td>

                        {/* Committees */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-secondary" />
                            <span className="font-medium">
                              {area.total_committees}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="glass-button">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                              align="end" 
                              className="glass-card border-white/20 bg-background/95 backdrop-blur-md z-50"
                            >
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditArea(area)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t('common.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('common.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Form Modal */}
      <GeoAreaForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        area={selectedArea}
        parentAreas={geoAreas.filter(area => area.type !== 'village')}
      />
    </div>
  );
};