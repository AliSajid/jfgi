<!--
SPDX-FileCopyrightText: 2022 - 2024 Ali Sajid Imami

SPDX-License-Identifier: MIT
-->

<script lang="ts">
  import yoda from '$lib/components/images/0637f1c2-d890-4510-9e80-830a3ee5ffe3.png?enhanced';
  import drake from '$lib/components/images/cd4cebb4-5acb-45cf-a3cb-a3ba80ba11ba.png?enhanced';
  import officespace from '$lib/components/images/55a4588f-084f-42d1-8a4b-17a11c1859f0.png?enhanced';
  // Pick a random image from the static directory
  const images = [
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
  const index = Math.floor(Math.random() * images.length);

  console.log('Loading Image', index);

  export const src = images[index];
</script>

<div class="mx-auto h-full flex-row justify-center object-center">
  <div class="carousel carousel-vertical mx-auto">
    <enhanced:img
      src={src.imagesrc}
      sizes="min(1280px, 40vw)"
      class="carousel-item mx-auto w-6/12 object-contain"
      alt={src.alt}
    />
  </div>
</div>
