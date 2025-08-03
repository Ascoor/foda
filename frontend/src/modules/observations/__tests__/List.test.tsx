import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { ObservationsList } from '../ObservationsList';

vi.mock('../api', () => ({
  fetchObservations: vi.fn().mockResolvedValue([
    { id: '1', observer: 'Obs A', committee_id: null, type: 'note', description: '', timestamp: '2024-01-01T00:00:00Z' }
  ]),
  deleteObservation: vi.fn(),
  mockCommittees: [],
}));

test('renders observations list', async () => {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <ObservationsList />
      </BrowserRouter>
    </QueryClientProvider>
  );
  await waitFor(() => expect(screen.getByText('Obs A')).toBeInTheDocument());
});
