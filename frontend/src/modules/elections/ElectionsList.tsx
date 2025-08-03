import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  Users,
  MapPin,
  Edit,
  Trash2,
  Eye
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
import { useLanguage } from '@/contexts/LanguageContext';

interface Election {
  id: string;
  name: string;
  type: 'presidential' | 'parliamentary' | 'local' | 'referendum';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  totalVoters: number;
  totalCandidates: number;
  description: string;
}

const mockElections: Election[] = [
  {
    id: '1',
    name: 'Presidential Election 2024',
    type: 'presidential',
    status: 'active',
    startDate: '2024-03-15',
    endDate: '2024-03-16',
    totalVoters: 15420,
    totalCandidates: 8,
    description: 'National presidential election for 2024-2028 term'
  },
  {
    id: '2',
    name: 'Parliamentary Elections',
    type: 'parliamentary',
    status: 'completed',
    startDate: '2023-12-10',
    endDate: '2023-12-11',
    totalVoters: 12890,
    totalCandidates: 156,
    description: 'National parliament member elections'
  },
  {
    id: '3',
    name: 'Local Council Elections',
    type: 'local',
    status: 'draft',
    startDate: '2024-05-20',
    endDate: '2024-05-21',
    totalVoters: 8750,
    totalCandidates: 42,
    description: 'Municipal and local council elections'
  }
];

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-success/10 text-success border-success/20',
  completed: 'bg-primary/10 text-primary border-primary/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20'
};

const typeColors = {
  presidential: 'bg-primary/10 text-primary',
  parliamentary: 'bg-secondary/10 text-secondary',
  local: 'bg-accent/10 text-accent',
  referendum: 'bg-warning/10 text-warning'
};

export const ElectionsList = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [elections] = useState(mockElections);
  const [isLoading, setIsLoading] = useState(false);

  const filteredElections = elections.filter(election =>
    election.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    election.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SkeletonRow = () => (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-white/10"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-muted/30 rounded animate-pulse" />
        </td>
      ))}
    </motion.tr>
  );

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
              {t('elections.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all election processes
            </p>
          </div>
          
          <Button className="glass-button bg-gradient-primary text-white shadow-glow">
            <Plus className="h-4 w-4 mr-2" />
            {t('elections.add_election')}
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
              className={`glass border-0 ${direction === 'rtl' ? 'pr-10' : 'pl-10'}`}
            />
          </div>
          
          <Button variant="outline" className="glass-button">
            <Filter className="h-4 w-4 mr-2" />
            {t('common.filter')}
          </Button>
        </div>
      </motion.div>

      {/* Elections Table */}
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
                  {t('elections.election_name')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('elections.election_type')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('common.status')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('elections.start_date')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Participants
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : (
                  filteredElections.map((election, index) => (
                    <motion.tr
                      key={election.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors group"
                    >
                      {/* Name & Description */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {election.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {election.description}
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={typeColors[election.type]}>
                          {t(`elections.types.${election.type}`)}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={statusColors[election.status]}>
                          {t(`elections.status.${election.status}`)}
                        </Badge>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(election.startDate).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Participants */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-primary" />
                            <span>{election.totalVoters.toLocaleString()} voters</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-secondary" />
                            <span>{election.totalCandidates} candidates</span>
                          </div>
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
                          <DropdownMenuContent align="end" className="glass-card">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
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
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!isLoading && filteredElections.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-muted-foreground text-lg mb-4">
              No elections found
            </div>
            <Button className="glass-button bg-gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create First Election
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};