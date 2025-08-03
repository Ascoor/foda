import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SwotPage from '../Swot';
import { LanguageProvider } from '@/contexts/LanguageContext';

describe('SwotPage', () => {
  it('renders title', () => {
    render(
      <LanguageProvider>
        <SwotPage />
      </LanguageProvider>
    );
    expect(screen.getByText(/swots/i)).toBeInTheDocument();
  });
});
