import { render, screen } from '@testing-library/svelte/svelte5';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Alt texts copied from the component to validate selection
const ALTS = [
  "Master Yoda looking at you; Overlay Text says 'Use Google, You Should'",
  "Drake meme: Top panel - Drake looking displeased and holding up his hand in rejection with the caption 'Googling the question beforehand.' Bottom panel - Drake smiling and pointing approvingly with the caption 'Asking the question without research.'",
  "Office Space meme: A man with glasses and a tie holding a coffee cup, with the caption 'If you could Google this before asking, that'd be great.'"
];

async function renderWithRandom(val: number) {
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(Math, 'random').mockReturnValue(val);
  const mod = await import('../../src/lib/components/ui/Image.svelte');
  const utils = render(mod.default);
  logSpy.mockRestore();
  return utils;
}

describe('Image', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders carousel wrapper and an image', async () => {
    const { container } = await renderWithRandom(0.0);
    const carousel = container.querySelector('.carousel.carousel-vertical');
    expect(carousel).toBeInTheDocument();

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('carousel-item', 'mx-auto', 'w-6/12', 'object-contain');
  });

  it('picks Yoda when random ~ 0.0 (index 0)', async () => {
    await renderWithRandom(0.0);
    const img = screen.getByRole('img', { name: ALTS[0] });
    expect(img).toBeInTheDocument();
  });

  it('picks Drake when random ~ 0.4 (index 1)', async () => {
    await renderWithRandom(0.4); // floor(0.4 * 3) = 1
    const img = screen.getByRole('img', { name: ALTS[1] });
    expect(img).toBeInTheDocument();
  });

  it('picks Office Space when random ~ 0.9 (index 2)', async () => {
    await renderWithRandom(0.9); // floor(0.9 * 3) = 2
    const img = screen.getByRole('img', { name: ALTS[2] });
    expect(img).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { container } = await renderWithRandom(0.0);
    expect(container).toMatchSnapshot();
  });
});
