import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '@/contexts/AuthContext';
import { Login } from '../Login';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: { token: 't' } })),
  },
  setAuthToken: vi.fn(),
}));

test('renders login form and submits', async () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );

  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'a' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'b' } });
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));

  await waitFor(() => {
    expect(api.post).toHaveBeenCalled();
  });
});
