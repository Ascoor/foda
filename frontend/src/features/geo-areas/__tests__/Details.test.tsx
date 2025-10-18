import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { GeoAreaDetails } from '../Details';
import { vi } from 'vitest';

vi.mock('../api', () => ({
  fetchGeoArea: vi.fn().mockResolvedValue({ id: '1', name: 'Area A', parent_id: null, type: 'city', total_voters: 0, total_committees: 0, created_at: '', updated_at: '' }),
  deleteGeoArea: vi.fn(),
}));

test('renders geo area details', async () => {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <MemoryRouter initialEntries={['/geo-areas/1']}>
          <Routes>
            <Route path="/geo-areas/:id" element={<GeoAreaDetails />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
  await waitFor(() => expect(screen.getByText('Area A')).toBeInTheDocument());
});
