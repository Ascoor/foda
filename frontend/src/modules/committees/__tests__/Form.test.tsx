import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { CommitteeForm } from '../Form';

vi.mock('../api', () => ({ fetchGeoAreas: vi.fn().mockResolvedValue({ data: [] }) }));

test('submits committee form', async () => {
  const onSubmit = vi.fn();
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <CommitteeForm onSubmit={onSubmit} defaultValues={{ name: '', location: '', geo_area_id: '1' }} />
    </QueryClientProvider>
  );
  fireEvent.change(screen.getByPlaceholderText('Committee Name'), { target: { value: 'New' } });
  fireEvent.change(screen.getByPlaceholderText('Location'), { target: { value: 'Loc' } });
  fireEvent.click(screen.getByText(/save/i));
  expect(onSubmit).toHaveBeenCalled();
});
