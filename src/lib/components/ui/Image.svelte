<!--
SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami

SPDX-License-Identifier: MIT
-->

<script lang="ts">
  import { selectImage, type SelectedImage } from '$lib/data/imageData';
  // Pick a random image from the static directory
  const selected: SelectedImage = selectImage();

  const isTest = process.env.VITEST;

  console.log('Loading Image', selected);

  export const src = selected;
</script>

<div class="mx-auto h-full flex-row justify-center object-center">
  <div class="carousel carousel-vertical mx-auto">
    {#if isTest}
      <img
        src={src.imagesrc.src ?? src.imagesrc}
        sizes="min(1280px, 40vw)"
        class="carousel-item mx-auto w-6/12 object-contain"
        alt={src.alt}
      />
    {:else}
      <enhanced:img
        src={src.imagesrc}
        sizes="min(1280px, 40vw)"
        class="carousel-item mx-auto w-6/12 object-contain"
        alt={src.alt}
      />
    {/if}
  </div>
</div>
