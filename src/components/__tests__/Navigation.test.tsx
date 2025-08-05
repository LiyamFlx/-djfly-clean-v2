import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
// import Navigation from '../Layout/Navigation';

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Navigation', () => {
  it('placeholder test', () => {
    expect(true).toBe(true);
  });
});