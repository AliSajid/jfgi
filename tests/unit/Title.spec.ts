import { render, screen } from '@testing-library/svelte/svelte5';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { tick } from 'svelte';
import Title from '../../src/lib/components/ui/Title.svelte'; // Adjust the path as needed

describe('Title', () => {
  it('renders the title correctly', () => {
    // Render the component with a test title
    const title = 'Test Title';
    render(Title, { props: { title } });

    // Check if the title is rendered
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(title);
  });

  it('applies the correct styles to the title', () => {
    // Render the component
    const title = 'Styled Title';
    render(Title, { props: { title } });

    // Check styles of the heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('font-serif text-xl font-bold md:text-3xl lg:text-5xl');
  });

  it('renders an h1 with correct role, level, and accessible name', () => {
    const title = 'Accessible Title';
    render(Title, { props: { title } });

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.tagName).toBe('H1');
    expect(heading).toHaveAccessibleName(title);
  });

  it('updates when the title prop changes', async () => {
    const { rerender } = render(Title, { props: { title: 'Initial Title' } });
    let heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Initial Title');

    await rerender({ title: 'Updated Title' });
    await tick();
    heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Updated Title');
  });

  it('applies correct container classes', () => {
    render(Title, { props: { title: 'Classes' } });
    const wrapper = document.querySelector('div.m-4');
    expect(wrapper).toHaveClass('m-4', 'flex', 'flex-row', 'justify-center', 'p-4');
  });

  it('matches snapshot', () => {
    const title = 'Snapshot Title';
    const { container } = render(Title, { props: { title } });
    expect(container).toMatchSnapshot();
  });
});
