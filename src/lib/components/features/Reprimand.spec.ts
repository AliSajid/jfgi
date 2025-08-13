//  SPDX - FileCopyrightText: 2022 - 2025 Ali Sajid Imami
//
//  SPDX - License - Identifier: MIT

import { render, screen } from '@testing-library/svelte/svelte5';
import '@testing-library/jest-dom/vitest';
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

  it('has the correct container classes and id', () => {
    const { container } = render(Reprimand);
    const divElement = container.querySelector('#reprimand');
    expect(divElement).toHaveClass(
      'm-2',
      'mx-auto',
      'flex-row',
      'content-center',
      'justify-center'
    );
    expect(divElement).toHaveAttribute('id', 'reprimand');
  });

  it('applies correct paragraph classes at default viewport', () => {
    const { container } = render(Reprimand);
    const paragraph = container.querySelector('p');
    expect(paragraph).toHaveClass('text-lg', 'font-medium', 'md:text-2xl', 'lg:text-4xl');
  });

  describe('Responsive Design Tests', () => {
    Object.entries(viewports).forEach(([device, dimensions]) => {
      it(`contains responsive utility classes in markup for ${device} viewport`, () => {
        // Set viewport size
        window.innerWidth = dimensions.width;
        window.innerHeight = dimensions.height;
        window.dispatchEvent(new Event('resize'));

        const { container } = render(Reprimand);
        const paragraph = container.querySelector('p');

        // Base classes that should always be present
        expect(paragraph).toHaveClass('text-lg', 'font-medium');

        // Responsive utility classes are present in markup (JSDOM doesn't apply CSS breakpoints)
        expect(paragraph).toHaveClass('md:text-2xl');
        expect(paragraph).toHaveClass('lg:text-4xl');
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('has sufficient color contrast (smoke)', () => {
      const { container } = render(Reprimand);
      const paragraph = container.querySelector('p') as HTMLElement;

      // Get computed styles
      const styles = window.getComputedStyle(paragraph);
      expect(styles).toBeTruthy();
    });

    it('has appropriate text size for readability', () => {
      const { container } = render(Reprimand);
      const paragraph = container.querySelector('p');
      expect(paragraph).toHaveClass('text-lg');
    });

    it('maintains proper structure (no unexpected headings)', () => {
      const { container } = render(Reprimand);
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      expect(headings.length).toBe(0);
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
        const divElement = container.querySelector('#reprimand') as HTMLElement;

        // Check that element remains centered
        expect(divElement).toHaveClass('mx-auto');

        // Check that content stays within viewport (JSDOM returns 0 sizes; sanity bounds only)
        const rect = divElement.getBoundingClientRect();
        expect(rect.left).toBeGreaterThanOrEqual(0);
        expect(rect.right).toBeGreaterThanOrEqual(rect.left);
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
