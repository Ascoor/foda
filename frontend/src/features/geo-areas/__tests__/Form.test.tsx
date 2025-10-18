import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { GeoAreaForm } from '../Form';
import { vi } from 'vitest';

vi.mock('../api', () => ({
  createGeoArea: vi.fn(),
  updateGeoArea: vi.fn(),
}));

test('renders geo area form', () => {
  render(
    <LanguageProvider>
      <GeoAreaForm isOpen={true} onClose={() => {}} onSuccess={() => {}} parentAreas={[]} />
    </LanguageProvider>
  );
  expect(screen.getByText(/Area Name/i)).toBeInTheDocument();
});
