import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button, buttonVariants } from '../button';

describe('Button', () => {
  it('renders the provided label', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies the requested variant styles', () => {
    render(<Button variant="outline">Action</Button>);

    const button = screen.getByRole('button', { name: /action/i });
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('hover:bg-accent');
  });

  it('supports custom class names merged with variants', () => {
    const customClass = 'text-red-500';
    render(
      <Button variant="ghost" className={customClass}>
        Decorated
      </Button>
    );

    const button = screen.getByRole('button', { name: /decorated/i });
    expect(button).toHaveClass(customClass);
    expect(buttonVariants({ variant: 'ghost' })).toContain('hover:bg-accent');
  });
});
