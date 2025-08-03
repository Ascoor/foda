/**
 * Test skeleton for EventDetails component.
 * Run: npx vitest run Event/EventDetails.test.tsx
 */
import React from 'react';
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import EventDetails from './EventDetails';

describe('EventDetails', () => {
  it('renders without crashing', () => {
    render(<EventDetails />);
  });
});
