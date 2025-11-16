/**
 * @fileoverview Tests für ImageUpload Component
 *
 * TESTED:
 * - Rendering of component
 * - File upload handling
 * - Max images limit (5)
 * - Image removal
 * - Caption management
 * - Image reordering (move up/down)
 * - Auto-enhance toggle
 * - Disabled state when max reached
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * DATUM: 2025-11-15
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';

import ImageUpload from './ImageUpload';
import useExposeStore from '../stores/exposeStore';
import { enhanceImage } from '../utils/imageEnhancer';

// Mock dependencies
vi.mock('react-hot-toast');
vi.mock('../utils/imageEnhancer');

// Mock FileReader
global.FileReader = class FileReader {
  result: string | null = null;
  onload: ((e: ProgressEvent<FileReader>) => void) | null = null;
  onerror: (() => void) | null = null;

  readAsDataURL(file: File) {
    // Simulate async file reading
    setTimeout(() => {
      this.result = `data:image/jpeg;base64,fake-${file.name}`;
      if (this.onload) {
        this.onload({ target: this } as ProgressEvent<FileReader>);
      }
    }, 0);
  }
} as any;

describe('ImageUpload', () => {
  beforeEach(() => {
    // Reset store before each test
    const { getState } = useExposeStore;
    useExposeStore.setState({
      images: [],
      captions: [],
    });

    vi.clearAllMocks();
    vi.mocked(toast.loading).mockReturnValue('toast-id');
    vi.mocked(toast.success).mockReturnValue('toast-id');
    vi.mocked(toast.error).mockReturnValue('toast-id');
    vi.mocked(toast.dismiss).mockReturnValue(undefined);
    vi.mocked(enhanceImage).mockResolvedValue('data:image/jpeg;base64,enhanced');
  });

  describe('Rendering', () => {
    it('should render upload label', () => {
      render(<ImageUpload />);

      expect(screen.getByText(/📸 Objektfotos \(max\. 5\)/)).toBeInTheDocument();
    });

    it('should render file input', () => {
      render(<ImageUpload />);

      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    });

    it('should render auto-enhance checkbox', () => {
      render(<ImageUpload />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText(/Bild automatisch optimieren/)).toBeInTheDocument();
    });

    it('should not show max limit message initially', () => {
      render(<ImageUpload />);

      expect(screen.queryByText(/Maximale Anzahl Bilder erreicht/)).not.toBeInTheDocument();
    });
  });

  describe('Auto-Enhance Toggle', () => {
    it('should toggle auto-enhance checkbox', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('File Upload', () => {
    it('should accept image files', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      await user.upload(input, file);

      await waitFor(() => {
        const { images } = useExposeStore.getState();
        expect(images).toHaveLength(1);
      });
    });

    it('should show loading toast during upload', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      await user.upload(input, file);

      expect(toast.loading).toHaveBeenCalledWith(
        expect.stringContaining('Bild(er) werden hochgeladen')
      );
    });

    it('should show success toast after upload', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      await user.upload(input, file);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          expect.stringContaining('hochgeladen')
        );
      });
    });

    it('should create empty caption for uploaded image', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      await user.upload(input, file);

      await waitFor(() => {
        const { captions } = useExposeStore.getState();
        expect(captions).toHaveLength(1);
        expect(captions[0]).toBe('');
      });
    });

    it('should handle multiple file upload', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const files = [
        new File(['content1'], 'image1.jpg', { type: 'image/jpeg' }),
        new File(['content2'], 'image2.jpg', { type: 'image/jpeg' }),
        new File(['content3'], 'image3.jpg', { type: 'image/jpeg' }),
      ];

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, files);

      await waitFor(() => {
        const { images } = useExposeStore.getState();
        expect(images).toHaveLength(3);
      });
    });
  });

  describe('Max Images Limit', () => {
    it('should disable file input when max images reached', () => {
      useExposeStore.setState({
        images: ['img1', 'img2', 'img3', 'img4', 'img5'],
        captions: ['', '', '', '', ''],
      });

      render(<ImageUpload />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it('should show info message when max reached', () => {
      useExposeStore.setState({
        images: ['img1', 'img2', 'img3', 'img4', 'img5'],
        captions: ['', '', '', '', ''],
      });

      render(<ImageUpload />);

      expect(screen.getByText(/Maximale Anzahl Bilder erreicht/)).toBeInTheDocument();
    });

    it('should only upload remaining slots', async () => {
      const user = userEvent.setup();

      // Pre-fill with 3 images
      useExposeStore.setState({
        images: ['img1', 'img2', 'img3'],
        captions: ['', '', ''],
      });

      render(<ImageUpload />);

      // Try to upload 5 more (should only accept 2)
      const files = [
        new File(['c1'], 'img1.jpg', { type: 'image/jpeg' }),
        new File(['c2'], 'img2.jpg', { type: 'image/jpeg' }),
        new File(['c3'], 'img3.jpg', { type: 'image/jpeg' }),
        new File(['c4'], 'img4.jpg', { type: 'image/jpeg' }),
        new File(['c5'], 'img5.jpg', { type: 'image/jpeg' }),
      ];

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, files);

      await waitFor(() => {
        const { images } = useExposeStore.getState();
        expect(images).toHaveLength(5); // 3 existing + 2 new
      });
    });
  });

  describe('Image Display and Captions', () => {
    beforeEach(() => {
      useExposeStore.setState({
        images: ['data:image/jpeg;base64,img1', 'data:image/jpeg;base64,img2'],
        captions: ['Caption 1', 'Caption 2'],
      });
    });

    it('should display uploaded images', () => {
      render(<ImageUpload />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'data:image/jpeg;base64,img1');
      expect(images[1]).toHaveAttribute('src', 'data:image/jpeg;base64,img2');
    });

    it('should display caption inputs', () => {
      render(<ImageUpload />);

      const captionInputs = screen.getAllByPlaceholderText('Bildunterschrift (optional)');
      expect(captionInputs).toHaveLength(2);
      expect(captionInputs[0]).toHaveValue('Caption 1');
      expect(captionInputs[1]).toHaveValue('Caption 2');
    });

    it('should update caption on input', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const captionInputs = screen.getAllByPlaceholderText('Bildunterschrift (optional)');
      await user.clear(captionInputs[0]);
      await user.type(captionInputs[0], 'New Caption');

      const { captions } = useExposeStore.getState();
      expect(captions[0]).toBe('New Caption');
    });
  });

  describe('Image Removal', () => {
    beforeEach(() => {
      useExposeStore.setState({
        images: ['img1', 'img2', 'img3'],
        captions: ['cap1', 'cap2', 'cap3'],
      });
    });

    it('should remove image when delete button clicked', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const deleteButtons = screen.getAllByTitle('Bild löschen');
      await user.click(deleteButtons[1]); // Remove second image

      const { images, captions } = useExposeStore.getState();
      expect(images).toHaveLength(2);
      expect(images).toEqual(['img1', 'img3']);
      expect(captions).toHaveLength(2);
      expect(captions).toEqual(['cap1', 'cap3']);
    });

    it('should show success toast when image removed', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const deleteButtons = screen.getAllByTitle('Bild löschen');
      await user.click(deleteButtons[0]);

      expect(toast.success).toHaveBeenCalledWith('🗑️ Bild entfernt');
    });
  });

  describe('Image Reordering', () => {
    beforeEach(() => {
      useExposeStore.setState({
        images: ['img1', 'img2', 'img3'],
        captions: ['cap1', 'cap2', 'cap3'],
      });
    });

    it('should move image up', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const moveUpButtons = screen.getAllByTitle('Bild nach oben verschieben');
      await user.click(moveUpButtons[1]); // Move second image up

      const { images, captions } = useExposeStore.getState();
      expect(images).toEqual(['img2', 'img1', 'img3']);
      expect(captions).toEqual(['cap2', 'cap1', 'cap3']);
    });

    it('should move image down', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const moveDownButtons = screen.getAllByTitle('Bild nach unten verschieben');
      await user.click(moveDownButtons[0]); // Move first image down

      const { images, captions } = useExposeStore.getState();
      expect(images).toEqual(['img2', 'img1', 'img3']);
      expect(captions).toEqual(['cap2', 'cap1', 'cap3']);
    });

    it('should disable move up button for first image', () => {
      render(<ImageUpload />);

      const moveUpButtons = screen.getAllByTitle('Bild nach oben verschieben');
      expect(moveUpButtons[0]).toBeDisabled();
      expect(moveUpButtons[1]).not.toBeDisabled();
    });

    it('should disable move down button for last image', () => {
      render(<ImageUpload />);

      const moveDownButtons = screen.getAllByTitle('Bild nach unten verschieben');
      const lastIndex = moveDownButtons.length - 1;
      expect(moveDownButtons[lastIndex]).toBeDisabled();
      expect(moveDownButtons[0]).not.toBeDisabled();
    });
  });

  describe('Auto-Enhancement', () => {
    it('should call enhanceImage when auto-enhance is enabled', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      // Enable auto-enhance
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      await user.upload(input, file);

      await waitFor(() => {
        expect(enhanceImage).toHaveBeenCalled();
      });
    });

    it('should not call enhanceImage when auto-enhance is disabled', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      await user.upload(input, file);

      await waitFor(() => {
        const { images } = useExposeStore.getState();
        expect(images).toHaveLength(1);
      });

      expect(enhanceImage).not.toHaveBeenCalled();
    });

    it('should fallback to original image if enhancement fails', async () => {
      const user = userEvent.setup();
      vi.mocked(enhanceImage).mockRejectedValue(new Error('Enhancement failed'));

      render(<ImageUpload />);

      // Enable auto-enhance
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      await user.upload(input, file);

      await waitFor(() => {
        const { images } = useExposeStore.getState();
        expect(images).toHaveLength(1);
        // Should use original base64, not enhanced
        expect(images[0]).toContain('fake-test.jpg');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty file list', async () => {
      const user = userEvent.setup();
      render(<ImageUpload />);

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      // Trigger change with no files
      await user.upload(input, []);

      const { images } = useExposeStore.getState();
      expect(images).toHaveLength(0);
    });

    it('should handle invalid index for move operations', async () => {
      useExposeStore.setState({
        images: ['img1'],
        captions: ['cap1'],
      });

      render(<ImageUpload />);

      const moveUpButton = screen.getByTitle('Bild nach oben verschieben');
      const moveDownButton = screen.getByTitle('Bild nach unten verschieben');

      // Both should be disabled for single image
      expect(moveUpButton).toBeDisabled();
      expect(moveDownButton).toBeDisabled();
    });
  });
});
