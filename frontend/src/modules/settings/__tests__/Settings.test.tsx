import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Settings } from '../Settings';

vi.mock('../api', () => ({
  fetchSettings: vi.fn().mockResolvedValue({ language: 'en', region: 'US', allowRegistration: true }),
  updateSettings: vi.fn(),
}));

test('renders settings form', async () => {
  render(<Settings />);
  await waitFor(() => {
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
  });
});
