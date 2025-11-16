/**
 * @fileoverview Tests für AuthGate Component
 *
 * TESTED:
 * - Rendering children when authenticated
 * - Showing fallback when not authenticated
 * - Loading state display
 * - Custom fallback messages
 * - Login link navigation with state
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * DATUM: 2025-11-15
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import AuthGate from './AuthGate';
import * as AuthContext from '../context/AuthContext';

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('AuthGate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('When Authenticated', () => {
    beforeEach(() => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: { id: 'user-123', email: 'test@example.com' } as any,
        loading: false,
        error: null,
        signInWithPassword: vi.fn(),
        signInWithMagicLink: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        getAccessToken: vi.fn(),
      });
    });

    it('should render children when user is authenticated', () => {
      render(
        <BrowserRouter>
          <AuthGate>
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should not render fallback message when authenticated', () => {
      render(
        <BrowserRouter>
          <AuthGate fallbackMessage="Custom message">
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      expect(screen.queryByText('Custom message')).not.toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <BrowserRouter>
          <AuthGate>
            <div>Child 1</div>
            <div>Child 2</div>
            <div>Child 3</div>
          </AuthGate>
        </BrowserRouter>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });
  });

  describe('When Not Authenticated', () => {
    beforeEach(() => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: null,
        loading: false,
        error: null,
        signInWithPassword: vi.fn(),
        signInWithMagicLink: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        getAccessToken: vi.fn(),
      });
    });

    it('should render fallback message when user is not authenticated', () => {
      render(
        <BrowserRouter>
          <AuthGate>
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      expect(screen.getByText('Bitte einloggen, um ein Exposé zu erstellen.')).toBeInTheDocument();
    });

    it('should not render children when not authenticated', () => {
      render(
        <BrowserRouter>
          <AuthGate>
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should render custom fallback message', () => {
      render(
        <BrowserRouter>
          <AuthGate fallbackMessage="Bitte melden Sie sich an">
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      expect(screen.getByText('Bitte melden Sie sich an')).toBeInTheDocument();
    });

    it('should render login button', () => {
      render(
        <BrowserRouter>
          <AuthGate>
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      const loginButton = screen.getByRole('button', { name: /zum login/i });
      expect(loginButton).toBeInTheDocument();
    });

    it('should render link to login page', () => {
      render(
        <BrowserRouter>
          <AuthGate>
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      const loginLink = screen.getByRole('link');
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: null,
        loading: true,
        error: null,
        signInWithPassword: vi.fn(),
        signInWithMagicLink: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        getAccessToken: vi.fn(),
      });
    });

    it('should render loading message when loading', () => {
      render(
        <BrowserRouter>
          <AuthGate>
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      expect(screen.getByText('Lade…')).toBeInTheDocument();
    });

    it('should not render children when loading', () => {
      render(
        <BrowserRouter>
          <AuthGate>
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should not render fallback message when loading', () => {
      render(
        <BrowserRouter>
          <AuthGate>
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      expect(screen.queryByText('Bitte einloggen, um ein Exposé zu erstellen.')).not.toBeInTheDocument();
    });

    it('should apply opacity style to loading message', () => {
      render(
        <BrowserRouter>
          <AuthGate>
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      const loadingDiv = screen.getByText('Lade…');
      expect(loadingDiv).toHaveStyle({ opacity: '0.8' });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: { id: 'user-123', email: 'test@example.com' } as any,
        loading: false,
        error: null,
        signInWithPassword: vi.fn(),
        signInWithMagicLink: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        getAccessToken: vi.fn(),
      });

      const { container } = render(
        <BrowserRouter>
          <AuthGate>{null}</AuthGate>
        </BrowserRouter>
      );

      // Should render without crashing
      expect(container).toBeInTheDocument();
    });

    it('should handle undefined user gracefully', () => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: undefined as any,
        loading: false,
        error: null,
        signInWithPassword: vi.fn(),
        signInWithMagicLink: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        getAccessToken: vi.fn(),
      });

      render(
        <BrowserRouter>
          <AuthGate>
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      // Should treat undefined as not authenticated
      expect(screen.getByText('Bitte einloggen, um ein Exposé zu erstellen.')).toBeInTheDocument();
    });

    it('should transition from loading to authenticated', () => {
      const { rerender } = render(
        <BrowserRouter>
          <AuthGate>
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      // Start with loading
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: null,
        loading: true,
        error: null,
        signInWithPassword: vi.fn(),
        signInWithMagicLink: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        getAccessToken: vi.fn(),
      });

      rerender(
        <BrowserRouter>
          <AuthGate>
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      expect(screen.getByText('Lade…')).toBeInTheDocument();

      // Then load user
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: { id: 'user-123', email: 'test@example.com' } as any,
        loading: false,
        error: null,
        signInWithPassword: vi.fn(),
        signInWithMagicLink: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        getAccessToken: vi.fn(),
      });

      rerender(
        <BrowserRouter>
          <AuthGate>
            <div>Protected Content</div>
          </AuthGate>
        </BrowserRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Lade…')).not.toBeInTheDocument();
    });
  });
});
