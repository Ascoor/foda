import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { ElectionsList } from '../List';
import { LanguageProvider } from '@/contexts/LanguageContext';

vi.mock('../api', () => ({
  fetchElections: vi.fn().mockResolvedValue({
    data: [
      {
        id: '1',
        name: 'Election A',
        type: 'presidential',
        status: 'draft',
        start_date: '2024-01-01',
        end_date: '2024-01-02',
      },
    ],
    total: 1,
  }),
  deleteElection: vi.fn(),
  createElection: vi.fn(),
  updateElection: vi.fn(),
}));

test('renders election list', async () => {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <BrowserRouter>
          <ElectionsList />
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
  await waitFor(() => expect(screen.getByText('Election A')).toBeInTheDocument());
});
