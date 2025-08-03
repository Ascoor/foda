import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { VotersList } from '../List';
import { LanguageProvider } from '@/contexts/LanguageContext';

vi.mock('../api', () => ({
  fetchVoters: vi.fn().mockResolvedValue({
    data: [
      {
        id: '1',
        full_name: 'Voter A',
        national_id: '123',
        gender: 'male',
        mobile: '0100',
      },
    ],
    total: 1,
  }),
  deleteVoter: vi.fn(),
  createVoter: vi.fn(),
  updateVoter: vi.fn(),
}));

test('renders voters list', async () => {
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
