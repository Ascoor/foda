import { useMemo } from 'react';
import { mansouraZones } from '../data/mansouraZones';
import type { ElectoralZone, ElectoralZoneStatus } from '../types';

type StatusFilter = ElectoralZoneStatus | 'الكل' | undefined;

interface UseZoneFilterResult {
  filteredZones: ElectoralZone[];
  totalZones: number;
  totalVoters: number;
  totalVolunteers: number;
  totalCommittees: number;
}

const normalize = (value: string) => (value ? value.toLowerCase().trim() : '');

export const useZoneFilter = (
  searchTerm: string,
  statusFilter?: StatusFilter,
  sourceZones: ElectoralZone[] = mansouraZones
): UseZoneFilterResult => {
  const normalizedSearch = normalize(searchTerm);

  const filteredZones = useMemo(() => {
    return sourceZones.filter((zone) => {
      const zoneNameNormalized = normalize(zone.name);

      const matchesSearch = !normalizedSearch
        || zoneNameNormalized.includes(normalizedSearch)
        || zone.id.toLowerCase().includes(normalizedSearch)
        || zone.voters.toString().includes(normalizedSearch)
        || zone.volunteers.toString().includes(normalizedSearch)
        || zone.committees.toString().includes(normalizedSearch);

      const matchesStatus = !statusFilter
        || statusFilter === 'الكل'
        || zone.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [normalizedSearch, sourceZones, statusFilter]);

  const { totalVoters, totalVolunteers, totalCommittees } = useMemo(() => {
    return filteredZones.reduce(
      (acc, zone) => {
        acc.totalVoters += zone.voters;
        acc.totalVolunteers += zone.volunteers;
        acc.totalCommittees += zone.committees;
        return acc;
      },
      { totalVoters: 0, totalVolunteers: 0, totalCommittees: 0 }
    );
  }, [filteredZones]);

  return {
    filteredZones,
    totalZones: filteredZones.length,
    totalVoters,
    totalVolunteers,
    totalCommittees,
  };
};
