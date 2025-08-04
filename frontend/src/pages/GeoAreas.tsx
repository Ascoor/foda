import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockGeoAreas, GeoAreaData, getCampaignStatusLabel } from '@/data/mockGeoData';
import { 
  Map, 
  List, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  RefreshCw,
  Eye,
  Settings,
  BarChart3
} from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

// Custom Components
import InteractiveMap from '@/components/geo-areas/InteractiveMap';
import GeoAreaStats from '@/components/geo-areas/GeoAreaStats';
// List component would be imported here

const GeoAreas: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const [geoAreas, setGeoAreas] = useState<GeoAreaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState<GeoAreaData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Load data on component mount
  useEffect(() => {
    const loadGeoAreas = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setGeoAreas(mockGeoAreas);
        toast({
          title: t('geo_areas.title'),
          description: `${mockGeoAreas.length} ${t('geo_areas.areas')} loaded successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load geographic areas",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadGeoAreas();
  }, [t]);

  // Filter areas based on search and filters
  const filteredAreas = geoAreas.filter(area => {
    const matchesSearch = !searchTerm || 
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || area.campaignStatus === statusFilter;
    const matchesType = typeFilter === 'all' || area.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAreaClick = (area: GeoAreaData) => {
    setSelectedArea(area);
    toast({
      title: language === 'ar' ? area.name : area.nameEn,
      description: `${t('geo_areas.coverage_percentage')}: ${area.stats.coverage}%`,
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: t('common.success'),
        description: "Data refreshed successfully",
      });
    }, 1000);
  };

  const handleExport = () => {
    toast({
      title: t('geo_areas.export_data'),
      description: "Export functionality would be implemented here",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            {t('geo_areas.title')}
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage electoral geographic areas with interactive mapping and analytics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="glass-button">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExport} className="glass-button">
            <Download className="h-4 w-4 mr-2" />
            {t('geo_areas.export_data')}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="glass-button">
                <Settings className="h-4 w-4 mr-2" />
                Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-card">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                {t('geo_areas.add_area')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Statistics Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GeoAreaStats geoAreas={filteredAreas} />
      </motion.div>

      {/* Filters and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${direction === 'rtl' ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={t('geo_areas.search_areas')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`glass ${direction === 'rtl' ? 'pr-10' : 'pl-10'}`}
                />
              </div>
              
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-[200px] glass">
                  <SelectValue placeholder={t('geo_areas.filter_by_status')} />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="covered">{t('geo_areas.status.covered')}</SelectItem>
                  <SelectItem value="pending">{t('geo_areas.status.pending')}</SelectItem>
                  <SelectItem value="high_priority">{t('geo_areas.status.high_priority')}</SelectItem>
                  <SelectItem value="uncovered">{t('geo_areas.status.uncovered')}</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-[200px] glass">
                  <SelectValue placeholder={t('geo_areas.area_type')} />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="governorate">{t('geo_areas.types.governorate')}</SelectItem>
                  <SelectItem value="district">{t('geo_areas.types.district')}</SelectItem>
                  <SelectItem value="city">{t('geo_areas.types.city')}</SelectItem>
                  <SelectItem value="village">{t('geo_areas.types.village')}</SelectItem>
                </SelectContent>
              </Select>
              
              {/* View Toggle */}
              <div className="flex border border-border rounded-lg overflow-hidden glass">
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="rounded-none"
                >
                  <Map className="h-4 w-4 mr-2" />
                  {t('geo_areas.map_view')}
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="h-4 w-4 mr-2" />
                  {t('geo_areas.list_view')}
                </Button>
              </div>
            </div>
            
            {/* Results Count */}
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="secondary" className="glass">
                {filteredAreas.length} {t('geo_areas.areas')}
              </Badge>
              {selectedArea && (
                <Badge variant="outline" className="glass">
                  Selected: {language === 'ar' ? selectedArea.name : selectedArea.nameEn}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {viewMode === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <InteractiveMap
                geoAreas={filteredAreas}
                selectedArea={selectedArea}
                onAreaClick={handleAreaClick}
                filterStatus={statusFilter}
                className="w-full"
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <List className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">List View</h3>
                    <p className="text-muted-foreground">
                      Detailed list view would be implemented here with the existing components
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Selected Area Details */}
      {selectedArea && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('geo_areas.area_details')}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedArea(null)}
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('geo_areas.area_name')}
                  </p>
                  <p className="font-bold">
                    {language === 'ar' ? selectedArea.name : selectedArea.nameEn}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('geo_areas.area_type')}
                  </p>
                  <Badge variant="outline">
                    {t(`geo_areas.types.${selectedArea.type}`)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('geo_areas.campaign_status')}
                  </p>
                  <Badge 
                    variant="outline"
                    style={{ borderColor: selectedArea.color, color: selectedArea.color }}
                  >
                    {getCampaignStatusLabel(selectedArea.campaignStatus, language === 'ar')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('geo_areas.coverage_percentage')}
                  </p>
                  <p className="font-bold text-2xl">{selectedArea.stats.coverage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default GeoAreas;