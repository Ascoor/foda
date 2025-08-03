/**
 * Reusable React Query hooks for Area API.
 * Legacy reference: old/application/modules/area/controllers/area.php
 * Handles listing, creation, update, and deletion.
 *
 * Testing: covered via AreaTable and AreaForm components.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAreas, createArea, updateArea, deleteArea, AreaPayload } from '@/lib/areas';

export function useAreas(search?: string) {
  return useQuery({
    queryKey: ['areas', search],
    queryFn: () => fetchAreas(search ? { name: search } : undefined),
  });
}

export function useCreateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AreaPayload) => createArea(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['areas'] }),
  });
}

export function useUpdateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AreaPayload }) => updateArea(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['areas'] }),
  });
}

export function useDeleteArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteArea(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['areas'] }),
  });
}
