import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navigation from '../Layout/Navigation';

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Navigation', () => {
  it('renders navigation links', () => {
    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    );

    expect(screen.getByText('DJfly')).toBeInTheDocument();
    expect(screen.getByText('Magic Studio')).toBeInTheDocument();
    expect(screen.getByText('Player')).toBeInTheDocument();
  });

  it('displays mobile menu button on small screens', () => {
    render(
      <NavigationWrapper>
        <Navigation />
      </NavigationWrapper>
    );

    const menuButton = screen.getByLabelText('Open mobile menu');
    expect(menuButton).toBeInTheDocument();
  });
});