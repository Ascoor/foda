import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Input } from '../input';

describe('Input', () => {
  it('renders an accessible textbox', () => {
    render(<Input placeholder="Full name" aria-label="full name" />);

    const input = screen.getByRole('textbox', { name: /full name/i });
    expect(input).toHaveAttribute('placeholder', 'Full name');
  });

  it('merges custom class names with defaults', () => {
    const { container } = render(<Input className="text-primary" />);

    const input = container.querySelector('input');
    expect(input).toHaveClass('text-primary');
    expect(input).toHaveClass('w-full');
  });
});
