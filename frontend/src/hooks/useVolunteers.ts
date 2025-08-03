/**
 * Derived from legacy controller old/application/modules/volunteer/controllers/volunteer.php
 * Provides React Query hooks for volunteer CRUD operations.
 * Test instructions: render a component using these hooks and ensure list/add/edit/delete flow.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchVolunteers, createVolunteer, updateVolunteer, deleteVolunteer, VolunteerPayload } from '@/lib/volunteers';

export function useVolunteers(search?: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['volunteers', { search }],
    queryFn: () => fetchVolunteers({ name: search }),
  });

  const create = useMutation({
    mutationFn: (data: VolunteerPayload) => createVolunteer(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['volunteers'] }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: VolunteerPayload }) => updateVolunteer(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['volunteers'] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteVolunteer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['volunteers'] }),
  });

  return { ...query, create, update, remove };
}
