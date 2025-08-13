<!--
SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami
SPDX-License-Identifier: MIT
-->
<script lang="ts">
  import { browser } from '$app/environment';

  interface Props {
    timer?: number;
  }

  let { timer = 10 }: Props = $props();
  let duration = $derived(timer * 1000);

  // Initialize with values that will display correctly
  let elapsed = $state(0);
  let currentSecond = $state(timer); // Start with the full time
  let currentProgress = $state(100); // Start with 100% progress
  let frame: number;

  $effect(() => {
    if (browser) {
      let startTime = window.performance.now();

      function update() {
        const currentTime = window.performance.now();
        elapsed = Math.min(currentTime - startTime, duration);

        // Explicitly update the display values
        currentSecond = Math.max(Math.ceil((duration - elapsed) / 1000), 0);
        currentProgress = Math.max(100 - (elapsed / duration) * 100, 0);

        if (elapsed >= duration) {
          cancelAnimationFrame(frame);
        } else {
          frame = requestAnimationFrame(update);
        }
      }

      // Start the animation
      frame = requestAnimationFrame(update);

      // Cleanup function
      return () => {
        if (frame) cancelAnimationFrame(frame);
      };
    }
  });
</script>

<div
  class="mx-auto flex-row content-center object-center"
  id="countdown"
  data-testid="countdown-timer"
>
  <div class="radial-progress" style="--value:{currentProgress};" role="progressbar">
    <span class="countdown font-mono text-sm lg:text-2xl">
      <span style="--value:{currentSecond}"></span>
    </span>
  </div>
</div>
