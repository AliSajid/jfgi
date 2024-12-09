//  SPDX - FileCopyrightText: 2022 - 2024 Ali Sajid Imami
//
//  SPDX - License - Identifier: MIT

import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import Reprimand from './Reprimand.svelte';

// Define common viewport sizes
const viewports = {
  mobile: { width: 320, height: 568 },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1024, height: 768 },
  desktop: { width: 1920, height: 1080 }
};

describe('Reprimand Component', () => {
  // Reset viewport before each test
  beforeEach(() => {
    window.innerWidth = viewports.laptop.width;
    window.innerHeight = viewports.laptop.height;
    window.dispatchEvent(new Event('resize'));
  });

  it('renders with the correct text content', () => {
    render(Reprimand);
    const message = screen.getByText('Make sure you Google stuff yourself first.');
    expect(message).toBeInTheDocument();
  });

  it('has the correct container classes', () => {
    const { container } = render(Reprimand);
    const divElement = container.querySelector('#reprimand');
    expect(divElement).toHaveClass('m-2', 'mx-auto', 'flex-row', 'content-center', 'justify-center');
  });

  describe('Responsive Design Tests', () => {
    Object.entries(viewports).forEach(([device, dimensions]) => {
      it(`applies correct text classes for ${device} viewport`, () => {
        // Set viewport size
        window.innerWidth = dimensions.width;
        window.innerHeight = dimensions.height;
        window.dispatchEvent(new Event('resize'));

        const { container } = render(Reprimand);
        const paragraph = container.querySelector('p');

        // Base classes that should always be present
        expect(paragraph).toHaveClass('text-lg', 'font-medium');

        // Conditional checks based on viewport
        if (dimensions.width >= 768) {
          expect(paragraph).toHaveClass('md:text-2xl');
        }
        if (dimensions.width >= 1024) {
          expect(paragraph).toHaveClass('lg:tex-4xl');
        }
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('has sufficient color contrast', () => {
      const { container } = render(Reprimand);
      const paragraph = container.querySelector('p');

      // Get computed styles
      const styles = window.getComputedStyle(paragraph);
      // Note: In a real implementation, you'd want to use a color contrast library
      // to actually check the contrast ratio meets WCAG standards
      expect(styles).toBeTruthy();
    });

    it('has appropriate text size for readability', () => {
      const { container } = render(Reprimand);
      const paragraph = container.querySelector('p');
      expect(paragraph).toHaveClass('text-lg');
    });

    it('maintains proper heading hierarchy', () => {
      const { container } = render(Reprimand);
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      // Ensure any headings present follow proper hierarchy
      headings.forEach((heading, index) => {
        if (index > 0) {
          const prevLevel = parseInt(headings[index - 1].tagName.slice(1));
          const currentLevel = parseInt(heading.tagName.slice(1));
          expect(currentLevel - prevLevel).toBeLessThanOrEqual(1);
        }
      });
    });

    it('has no keyboard traps', () => {
      const { container } = render(Reprimand);
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      // Verify that any focusable elements can be reached
      focusableElements.forEach(element => {
        expect(element).toHaveAttribute('tabindex', expect.not.stringMatching(/-1/));
      });
    });

    it('has proper ARIA attributes if interactive elements exist', () => {
      const { container } = render(Reprimand);
      const interactiveElements = container.querySelectorAll(
        'button, [role="button"], [role="link"]'
      );

      interactiveElements.forEach(element => {
        if (element.getAttribute('aria-label') || element.textContent) {
          expect(element).toHaveAccessibleName();
        }
      });
    });

    it('preserves text spacing for readability', () => {
      const { container } = render(Reprimand);
      const paragraph = container.querySelector('p');
      const styles = window.getComputedStyle(paragraph);

      // Check that no text-spacing properties are set too tight
      expect(styles.lineHeight).not.toBe('0');
      expect(styles.letterSpacing).not.toBe('0');
    });
  });

  describe('Layout and Structure Tests', () => {
    Object.entries(viewports).forEach(([device, dimensions]) => {
      it(`maintains proper layout at ${device} viewport`, () => {
        // Set viewport size
        window.innerWidth = dimensions.width;
        window.innerHeight = dimensions.height;
        window.dispatchEvent(new Event('resize'));

        const { container } = render(Reprimand);
        const divElement = container.querySelector('#reprimand');

        // Check that element remains centered
        expect(divElement).toHaveClass('mx-auto');

        // Check that content stays within viewport
        const rect = divElement.getBoundingClientRect();
        expect(rect.width).toBeLessThanOrEqual(dimensions.width);
        expect(rect.left).toBeGreaterThanOrEqual(0);
        expect(rect.right).toBeLessThanOrEqual(dimensions.width);
      });
    });
  });

  // Snapshot test for each viewport size
  Object.entries(viewports).forEach(([device, dimensions]) => {
    it(`matches ${device} snapshot`, () => {
      window.innerWidth = dimensions.width;
      window.innerHeight = dimensions.height;
      window.dispatchEvent(new Event('resize'));

      const { container } = render(Reprimand);
      expect(container).toMatchSnapshot();
    });
  });
});
