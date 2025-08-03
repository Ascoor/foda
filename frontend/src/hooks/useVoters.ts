/**
 * Derived from legacy controller old/application/modules/voter/controllers/voter.php
 * Provides React Query hooks for voter CRUD and import/export.
 * Test instructions: use inside Voters page for list/search/add/edit/delete.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchVoters, createVoter, updateVoter, deleteVoter, VoterPayload } from '@/lib/voters';

export function useVoters(filters?: { name?: string; voter_id?: string; area_id?: string }) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['voters', filters],
    queryFn: () => fetchVoters(filters),
  });

  const create = useMutation({
    mutationFn: (data: VoterPayload) => createVoter(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['voters'] }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: VoterPayload }) => updateVoter(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['voters'] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteVoter(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['voters'] }),
  });

  return { ...query, create, update, remove };
}
