import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { VotersList } from '../List';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { fetchVoters } from '../api';

vi.mock('../api', () => ({
  fetchVoters: vi.fn(),
  deleteVoter: vi.fn(),
  createVoter: vi.fn(),
  updateVoter: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test('renders voters list', async () => {
  vi.mocked(fetchVoters).mockResolvedValueOnce({
    data: [
      {
        id: '1',
        full_name: 'Voter A',
        national_id: '123',
        birth_date: '1990-01-01',
        gender: 'male',
        mobile: '0100',
      },
    ],
    total: 1,
  });

  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <BrowserRouter>
          <VotersList />
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
  await waitFor(() => expect(screen.getByText('Voter A')).toBeInTheDocument());
});

test('handles undefined data', async () => {
  vi.mocked(fetchVoters).mockResolvedValueOnce({ data: undefined as any, total: 0 });

  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <BrowserRouter>
          <VotersList />
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );

  await waitFor(() => expect(screen.getByText(/No data/i)).toBeInTheDocument());
});
