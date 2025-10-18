import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import { ElectionDetails } from '../Details';
import { LanguageProvider } from '@/contexts/LanguageContext';

vi.mock('../api', () => ({
  fetchElection: vi.fn().mockResolvedValue({
    id: '1',
    name: 'Election A',
    type: 'presidential',
    status: 'draft',
    start_date: '2024-01-01',
    end_date: '2024-01-02',
  }),
  deleteElection: vi.fn(),
  updateElection: vi.fn(),
}));

test('renders election details', async () => {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <MemoryRouter initialEntries={['/elections/1']}>
          <Routes>
            <Route path="/elections/:id" element={<ElectionDetails />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
  await waitFor(() => expect(screen.getByText('Election A')).toBeInTheDocument());
});
