import { render, screen } from '@testing-library/svelte/svelte5';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import Title from './Title.svelte'; // Adjust the path as needed

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
});
