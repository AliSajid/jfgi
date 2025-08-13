import { describe, expect, it } from 'vitest';
import { selectImage, images } from './imageData';

const ALTS = images.map((i) => i.alt);

describe('imageData selectImage', () => {
  it('returns index 0 when rng ~ 0.0', () => {
    const img = selectImage(() => 0.0);
    expect(ALTS).toContain(img.alt);
    expect(img.alt).toBe(ALTS[0]);
  });

  it('returns index 1 when rng ~ 0.4', () => {
    const img = selectImage(() => 0.4);
    expect(img.alt).toBe(ALTS[1]);
  });

  it('returns index 2 when rng ~ 0.9', () => {
    const img = selectImage(() => 0.9);
    expect(img.alt).toBe(ALTS[2]);
  });
});
