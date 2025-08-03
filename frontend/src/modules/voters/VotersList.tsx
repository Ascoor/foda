import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Users,
  UserCheck,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Calendar,
  Phone,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTableSkeleton, EmptyState } from '@/components/ui/DataTableSkeleton';
import { AssignDialog } from '@/components/ui/AssignDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Voter, VoterFilters } from './types';
import { fetchVoters, mockCommittees, bulkAssignCommittee } from './api';
import { VoterForm } from './VoterForm';
import { VoterDetails } from './VoterDetails';

const statusColors = {
  active: 'bg-success/10 text-success border-success/20',
  inactive: 'bg-warning/10 text-warning border-warning/20',
  suspended: 'bg-destructive/10 text-destructive border-destructive/20'
};

const genderColors = {
  male: 'bg-primary/10 text-primary border-primary/20',
  female: 'bg-secondary/10 text-secondary border-secondary/20'
};

export const VotersList = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [voters, setVoters] = useState<Voter[]>([]);
  const [filteredVoters, setFilteredVoters] = useState<Voter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
  const [selectedVoters, setSelectedVoters] = useState<string[]>([]);
  const [filters, setFilters] = useState<VoterFilters>({});

  useEffect(() => {
    loadVoters();
  }, [filters]);

  useEffect(() => {
    // Apply search filter
    const filtered = voters.filter(voter =>
      voter.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.national_id.includes(searchTerm) ||
      voter.mobile.includes(searchTerm) ||
      (voter.email && voter.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredVoters(filtered);
  }, [voters, searchTerm]);

  const loadVoters = async () => {
    try {
      setIsLoading(true);
      const votersData = await fetchVoters(filters);
      setVoters(votersData);
    } catch (error) {
      console.error('Failed to load voters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVoter = () => {
    setSelectedVoter(null);
    setShowForm(true);
  };

  const handleEditVoter = (voter: Voter) => {
    setSelectedVoter(voter);
    setShowForm(true);
  };

  const handleViewVoter = (voter: Voter) => {
    setSelectedVoter(voter);
    setShowDetails(true);
  };

  const handleBulkAssign = () => {
    setShowAssignDialog(true);
  };

  const handleAssignCommittee = async (committeeIds: string[]) => {
    if (committeeIds.length > 0 && selectedVoters.length > 0) {
      try {
        await bulkAssignCommittee(selectedVoters, committeeIds[0]);
        setSelectedVoters([]);
        loadVoters();
      } catch (error) {
        console.error('Failed to assign committee:', error);
      }
    }
  };

  const handleSelectVoter = (voterId: string, isSelected: boolean) => {
    setSelectedVoters(prev =>
      isSelected
        ? [...prev, voterId]
        : prev.filter(id => id !== voterId)
    );
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
              {t('voters.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage voter registrations and committee assignments
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="glass-button">
              <Upload className="h-4 w-4 mr-2" />
              {t('voters.import_voters')}
            </Button>
            <Button variant="outline" className="glass-button">
              <Download className="h-4 w-4 mr-2" />
              {t('voters.export_voters')}
            </Button>
            <Button 
              onClick={handleAddVoter}
              className="glass-button bg-gradient-primary text-white shadow-glow"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('voters.add_voter')}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="glass-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {voters.length.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Voters</div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-success/20 to-success/10">
              <UserCheck className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {voters.filter(v => v.committee_id).length}
              </div>
              <div className="text-sm text-muted-foreground">Assigned</div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-warning/20 to-warning/10">
              <UserPlus className="h-6 w-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {voters.filter(v => !v.committee_id).length}
              </div>
              <div className="text-sm text-muted-foreground">Unassigned</div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10">
              <Calendar className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.round(voters.reduce((sum, v) => sum + calculateAge(v.birth_date), 0) / voters.length) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg Age</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${direction === 'rtl' ? 'right-3' : 'left-3'}`} />
            <Input
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`glass border-white/20 ${direction === 'rtl' ? 'pr-10' : 'pl-10'}`}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select
              value={filters.gender || ''}
              onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value as any || undefined }))}
            >
              <SelectTrigger className="glass border-white/20 w-32">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20 bg-background/95 backdrop-blur-md z-50">
                <SelectItem value="male">{t('voters.gender_options.male')}</SelectItem>
                <SelectItem value="female">{t('voters.gender_options.female')}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status || ''}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any || undefined }))}
            >
              <SelectTrigger className="glass border-white/20 w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20 bg-background/95 backdrop-blur-md z-50">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            {selectedVoters.length > 0 && (
              <Button
                onClick={handleBulkAssign}
                className="glass-button bg-gradient-secondary text-white"
              >
                {t('voters.bulk_assign')} ({selectedVoters.length})
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Voters Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-white/20"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVoters(filteredVoters.map(v => v.id));
                      } else {
                        setSelectedVoters([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('voters.full_name')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('voters.national_id')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Age / {t('voters.gender')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('voters.area')} / {t('voters.committee')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('common.status')}
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
                    <td colSpan={8} className="p-6">
                      <DataTableSkeleton rows={5} columns={8} />
                    </td>
                  </tr>
                ) : filteredVoters.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6">
                      <EmptyState
                        title="No voters found"
                        description="Start by adding voters or adjust your search filters"
                        icon={<Users className="h-8 w-8 text-muted-foreground" />}
                        action={
                          <Button 
                            onClick={handleAddVoter}
                            className="glass-button bg-gradient-primary text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('voters.add_voter')}
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  filteredVoters.map((voter, index) => (
                    <motion.tr
                      key={voter.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors group"
                    >
                      {/* Checkbox */}
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-white/20"
                          checked={selectedVoters.includes(voter.id)}
                          onChange={(e) => handleSelectVoter(voter.id, e.target.checked)}
                        />
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <div 
                          className="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer"
                          onClick={() => handleViewVoter(voter)}
                        >
                          {voter.full_name}
                        </div>
                      </td>

                      {/* National ID */}
                      <td className="px-6 py-4">
                        <code className="text-sm bg-muted/20 px-2 py-1 rounded">
                          {voter.national_id}
                        </code>
                      </td>

                      {/* Age & Gender */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {calculateAge(voter.birth_date)} years
                          </span>
                          <StatusBadge 
                            status={t(`voters.gender_options.${voter.gender}`)} 
                            className={genderColors[voter.gender]}
                          />
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            {voter.mobile}
                          </div>
                          {voter.email && (
                            <div className="text-xs text-muted-foreground">
                              {voter.email}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Area & Committee */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-3 w-3 text-primary" />
                            {voter.area_name}
                          </div>
                          {voter.committee_name ? (
                            <Badge variant="outline" className="text-xs">
                              {voter.committee_name}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-warning">
                              Unassigned
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge 
                          status={voter.status} 
                          className={statusColors[voter.status]}
                        />
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
                            <DropdownMenuItem onClick={() => handleViewVoter(voter)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditVoter(voter)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {t('common.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('common.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modals */}
      <VoterForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedVoter(null);
        }}
        onSuccess={() => {
          setShowForm(false);
          setSelectedVoter(null);
          loadVoters();
        }}
        voter={selectedVoter}
      />

      <VoterDetails
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedVoter(null);
        }}
        voter={selectedVoter}
        onEdit={(voter) => {
          setShowDetails(false);
          setSelectedVoter(voter);
          setShowForm(true);
        }}
      />

      <AssignDialog
        isOpen={showAssignDialog}
        onClose={() => setShowAssignDialog(false)}
        title={t('voters.bulk_assign')}
        items={mockCommittees.map(c => ({
          id: c.id,
          name: c.name,
          role: c.area_name
        }))}
        onAssign={handleAssignCommittee}
        multiSelect={false}
      />
    </div>
  );
};