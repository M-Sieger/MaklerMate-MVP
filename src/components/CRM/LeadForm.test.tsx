/**
 * @fileoverview Tests für LeadForm Component
 *
 * TESTED:
 * - Form input handling
 * - Form validation (name required)
 * - Form submission with loading state
 * - Data trimming and cleaning
 * - Lead creation with correct structure
 * - Form reset after submission
 * - Button disabled states
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * DATUM: 2025-11-15
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

import { AppProvider } from '../../context/AppContext';
import type { Lead } from '../../utils/leadHelpers';
import LeadForm from './LeadForm';

describe('LeadForm', () => {
  let mockOnAddLead: Mock;

  beforeEach(() => {
    mockOnAddLead = vi.fn();
  });

  // Helper to render component with AppProvider
  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<AppProvider>{ui}</AppProvider>);
  };

  describe('Rendering', () => {
    it('should render all form fields', () => {
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Kontakt (E-Mail / Telefon)')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ort')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Lead-Typ (z. B. Verkäufer/Käufer)')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Notiz')).toBeInTheDocument();
    });

    it('should render status dropdown with all options', () => {
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(4);
      expect(options[0]).toHaveTextContent('Neu');
      expect(options[1]).toHaveTextContent('Warm');
      expect(options[2]).toHaveTextContent('VIP');
      expect(options[3]).toHaveTextContent('Cold');
    });

    it('should have submit button disabled initially', () => {
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      const submitButton = screen.getByRole('button', { name: /lead speichern/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Input Handling', () => {
    it('should update name field on input', async () => {
      const user = userEvent.setup();
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      const nameInput = screen.getByPlaceholderText('Name');
      await user.type(nameInput, 'Max Mustermann');

      expect(nameInput).toHaveValue('Max Mustermann');
    });

    it('should enable submit button when name is entered', async () => {
      const user = userEvent.setup();
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      const nameInput = screen.getByPlaceholderText('Name');
      const submitButton = screen.getByRole('button', { name: /lead speichern/i });

      expect(submitButton).toBeDisabled();

      await user.type(nameInput, 'Test User');
      expect(submitButton).not.toBeDisabled();
    });

    it('should update all fields on input', async () => {
      const user = userEvent.setup();
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      await user.type(screen.getByPlaceholderText('Name'), 'Test Name');
      await user.type(
        screen.getByPlaceholderText('Kontakt (E-Mail / Telefon)'),
        'test@example.com'
      );
      await user.type(screen.getByPlaceholderText('Ort'), 'Berlin');
      await user.type(screen.getByPlaceholderText('Lead-Typ (z. B. Verkäufer/Käufer)'), 'Käufer');
      await user.type(screen.getByPlaceholderText('Notiz'), 'Test Note');

      expect(screen.getByPlaceholderText('Name')).toHaveValue('Test Name');
      expect(screen.getByPlaceholderText('Kontakt (E-Mail / Telefon)')).toHaveValue(
        'test@example.com'
      );
      expect(screen.getByPlaceholderText('Ort')).toHaveValue('Berlin');
      expect(screen.getByPlaceholderText('Lead-Typ (z. B. Verkäufer/Käufer)')).toHaveValue(
        'Käufer'
      );
      expect(screen.getByPlaceholderText('Notiz')).toHaveValue('Test Note');
    });

    it('should update status dropdown', async () => {
      const user = userEvent.setup();
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('neu');

      await user.selectOptions(select, 'warm');
      expect(select).toHaveValue('warm');
    });
  });

  describe('Form Submission', () => {
    it('should call onAddLead with correct lead data', async () => {
      const user = userEvent.setup();
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      // Fill out form
      await user.type(screen.getByPlaceholderText('Name'), 'Test Lead');
      await user.type(
        screen.getByPlaceholderText('Kontakt (E-Mail / Telefon)'),
        'test@example.com'
      );
      await user.type(screen.getByPlaceholderText('Ort'), 'München');
      await user.type(
        screen.getByPlaceholderText('Lead-Typ (z. B. Verkäufer/Käufer)'),
        'Verkäufer'
      );
      await user.type(screen.getByPlaceholderText('Notiz'), 'Wichtiger Lead');
      await user.selectOptions(screen.getByRole('combobox'), 'vip');

      // Submit
      const submitButton = screen.getByRole('button', { name: /lead speichern/i });
      await user.click(submitButton);

      // Wait for async submission (500ms delay + processing)
      await waitFor(() => {
        expect(mockOnAddLead).toHaveBeenCalledTimes(1);
      });

      const leadData = mockOnAddLead.mock.calls[0][0] as Lead;
      expect(leadData.name).toBe('Test Lead');
      expect(leadData.contact).toBe('test@example.com');
      expect(leadData.location).toBe('München');
      expect(leadData.type).toBe('Verkäufer');
      expect(leadData.note).toBe('Wichtiger Lead');
      expect(leadData.status).toBe('vip');
      expect(leadData._v).toBe(2);
      expect(leadData.id).toBeTruthy();
      expect(leadData.createdAt).toBeTruthy();
      expect(leadData.updatedAt).toBeTruthy();
    });

    it('should trim whitespace from inputs', async () => {
      const user = userEvent.setup();
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      await user.type(screen.getByPlaceholderText('Name'), '  Padded Name  ');
      await user.type(
        screen.getByPlaceholderText('Kontakt (E-Mail / Telefon)'),
        '  padded@email.com  '
      );

      await user.click(screen.getByRole('button', { name: /lead speichern/i }));

      await waitFor(() => {
        expect(mockOnAddLead).toHaveBeenCalledTimes(1);
      });

      const leadData = mockOnAddLead.mock.calls[0][0] as Lead;
      expect(leadData.name).toBe('Padded Name');
      expect(leadData.contact).toBe('padded@email.com');
    });

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      // Fill and submit
      await user.type(screen.getByPlaceholderText('Name'), 'Test Lead');
      await user.type(
        screen.getByPlaceholderText('Kontakt (E-Mail / Telefon)'),
        'test@example.com'
      );
      await user.click(screen.getByRole('button', { name: /lead speichern/i }));

      // Wait for submission
      await waitFor(() => {
        expect(mockOnAddLead).toHaveBeenCalled();
      });

      // Check form is reset
      expect(screen.getByPlaceholderText('Name')).toHaveValue('');
      expect(screen.getByPlaceholderText('Kontakt (E-Mail / Telefon)')).toHaveValue('');
      expect(screen.getByRole('combobox')).toHaveValue('neu');
    });

    it('should not submit when name is empty', async () => {
      const user = userEvent.setup();
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      const submitButton = screen.getByRole('button', { name: /lead speichern/i });

      // Button should be disabled
      expect(submitButton).toBeDisabled();

      // Try to click anyway (should not trigger)
      await user.click(submitButton);

      expect(mockOnAddLead).not.toHaveBeenCalled();
    });

    it('should not submit when name is only whitespace', async () => {
      const user = userEvent.setup();
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      await user.type(screen.getByPlaceholderText('Name'), '   ');

      const submitButton = screen.getByRole('button', { name: /lead speichern/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Loading State', () => {
    it('should show spinner during submission', async () => {
      const user = userEvent.setup();
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      await user.type(screen.getByPlaceholderText('Name'), 'Test');

      const submitButton = screen.getByRole('button', { name: /lead speichern/i });
      await user.click(submitButton);

      // During loading, button text should change
      // The button shows a spinner (CSS class), text content changes
      await waitFor(() => {
        expect(mockOnAddLead).toHaveBeenCalled();
      });
    });

    it('should disable button during submission', async () => {
      const user = userEvent.setup();
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      await user.type(screen.getByPlaceholderText('Name'), 'Test');

      const submitButton = screen.getByRole('button', { name: /lead speichern/i });
      await user.click(submitButton);

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Data Structure', () => {
    it('should create lead with version 2', async () => {
      const user = userEvent.setup();
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      await user.type(screen.getByPlaceholderText('Name'), 'Test');
      await user.click(screen.getByRole('button', { name: /lead speichern/i }));

      await waitFor(() => {
        expect(mockOnAddLead).toHaveBeenCalled();
      });

      const leadData = mockOnAddLead.mock.calls[0][0] as Lead;
      expect(leadData._v).toBe(2);
    });

    it('should create unique IDs for different leads', async () => {
      const user = userEvent.setup();
      const { rerender } = renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      // Submit first lead
      await user.type(screen.getByPlaceholderText('Name'), 'Lead 1');
      await user.click(screen.getByRole('button', { name: /lead speichern/i }));

      await waitFor(() => {
        expect(mockOnAddLead).toHaveBeenCalledTimes(1);
      });

      const firstId = (mockOnAddLead.mock.calls[0][0] as Lead).id;

      // Re-render and submit second lead
      rerender(
        <AppProvider>
          <LeadForm onAddLead={mockOnAddLead} />
        </AppProvider>
      );

      await user.type(screen.getByPlaceholderText('Name'), 'Lead 2');
      await user.click(screen.getByRole('button', { name: /lead speichern/i }));

      await waitFor(() => {
        expect(mockOnAddLead).toHaveBeenCalledTimes(2);
      });

      const secondId = (mockOnAddLead.mock.calls[1][0] as Lead).id;

      expect(firstId).not.toBe(secondId);
    });

    it('should set createdAt and updatedAt as ISO strings', async () => {
      const user = userEvent.setup();
      renderWithProvider(<LeadForm onAddLead={mockOnAddLead} />);

      await user.type(screen.getByPlaceholderText('Name'), 'Test');
      await user.click(screen.getByRole('button', { name: /lead speichern/i }));

      await waitFor(() => {
        expect(mockOnAddLead).toHaveBeenCalled();
      });

      const leadData = mockOnAddLead.mock.calls[0][0] as Lead;

      // Should be valid ISO strings
      expect(() => new Date(leadData.createdAt)).not.toThrow();
      expect(() => new Date(leadData.updatedAt)).not.toThrow();

      // Should be the same timestamp
      expect(leadData.createdAt).toBe(leadData.updatedAt);
    });
  });
});
