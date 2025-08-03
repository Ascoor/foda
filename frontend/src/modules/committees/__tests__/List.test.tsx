import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { CommitteesList } from '../List';

vi.mock('../api', () => ({
  fetchCommittees: vi.fn().mockResolvedValue({
    data: [{ id: '1', name: 'Committee A', location: 'Loc', geo_area_id: '1', geo_area_name: 'Area' }],
    total: 1,
  }),
  deleteCommittee: vi.fn(),
  createCommittee: vi.fn(),
  updateCommittee: vi.fn(),
  fetchGeoAreas: vi.fn().mockResolvedValue({ data: [] }),
}));

test('renders committee list', async () => {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <CommitteesList />
      </BrowserRouter>
    </QueryClientProvider>
  );
  await waitFor(() => expect(screen.getByText('Committee A')).toBeInTheDocument());
});
