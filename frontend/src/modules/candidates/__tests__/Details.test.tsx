import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import { CandidateDetails } from '../Details';
import { LanguageProvider } from '@/contexts/LanguageContext';

vi.mock('../api', () => ({
  fetchCandidate: vi.fn().mockResolvedValue({ id: '1', name: 'Candidate A', party: 'P', type: 'individual', status: 'active' }),
  deleteCandidate: vi.fn(),
  updateCandidate: vi.fn(),
}));

test('renders candidate details', async () => {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <MemoryRouter initialEntries={['/candidates/1']}>
          <Routes>
            <Route path="/candidates/:id" element={<CandidateDetails />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
  await waitFor(() => expect(screen.getByText('Candidate A')).toBeInTheDocument());
});
