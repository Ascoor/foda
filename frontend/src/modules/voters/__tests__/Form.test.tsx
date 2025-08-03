import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { VoterForm } from '../Form';
import { LanguageProvider } from '@/contexts/LanguageContext';

test('submits voter form', async () => {
  const onSubmit = vi.fn();
  const qc = new QueryClient();
  localStorage.setItem('language', 'en');
  render(
    <QueryClientProvider client={qc}>
      <LanguageProvider>
        <VoterForm
          onSubmit={onSubmit}
          defaultValues={{
            full_name: '',
            national_id: '',
            birth_date: '2024-01-01',
            gender: 'male',
            mobile: '',
            email: 'a@a.com',
            address: '',
          }}
        />
      </LanguageProvider>
    </QueryClientProvider>
  );
  fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'New' } });
  fireEvent.change(screen.getByPlaceholderText('National ID'), { target: { value: '123' } });
  fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '0100' } });
  fireEvent.click(screen.getByText(/save/i));
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
});
