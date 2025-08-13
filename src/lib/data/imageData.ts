// Image data and selection logic for Image.svelte
// SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami
// SPDX-License-Identifier: MIT

import yoda from '$lib/data/images/0637f1c2-d890-4510-9e80-830a3ee5ffe3.png?enhanced';
import drake from '$lib/data/images/cd4cebb4-5acb-45cf-a3cb-a3ba80ba11ba.png?enhanced';
import officespace from '$lib/data/images/55a4588f-084f-42d1-8a4b-17a11c1859f0.png?enhanced';

export type SelectedImage = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imagesrc: any;
  alt: string;
};

export const images: SelectedImage[] = [
  {
    imagesrc: yoda,
    alt: "Master Yoda looking at you; Overlay Text says 'Use Google, You Should'"
  },
  {
    imagesrc: drake,
    alt: "Drake meme: Top panel - Drake looking displeased and holding up his hand in rejection with the caption 'Googling the question beforehand.' Bottom panel - Drake smiling and pointing approvingly with the caption 'Asking the question without research.'"
  },
  {
    imagesrc: officespace,
    alt: "Office Space meme: A man with glasses and a tie holding a coffee cup, with the caption 'If you could Google this before asking, that'd be great.'"
  }
];

export function selectImage(rng: () => number = Math.random): SelectedImage {
  const index = Math.floor(rng() * images.length);
  return images[index];
}
