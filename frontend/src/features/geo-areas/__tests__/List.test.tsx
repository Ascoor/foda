import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { GeoAreasList } from '../List';
import { vi } from 'vitest';

vi.mock('../api', () => ({
  fetchGeoAreas: vi.fn().mockResolvedValue([
    { id: '1', name: 'Area A', parent_id: null, type: 'city', total_voters: 0, total_committees: 0, created_at: '', updated_at: '' },
  ]),
}));

test('renders geo areas list', async () => {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <GeoAreasList />
      </LanguageProvider>
    </QueryClientProvider>
  );
  await waitFor(() => expect(screen.getByText('Area A')).toBeInTheDocument());
});
