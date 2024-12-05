<!--
SPDX-FileCopyrightText: 2022 - 2024 Ali Sajid Imami

SPDX-License-Identifier: MIT
-->

<script lang="ts">
  import { browser } from '$app/environment';
  interface Props {
    timer?: number;
  }

  let { timer = 10 }: Props = $props();

  let duration: number = timer * 1000;
  let elapsed: number = duration;
  let currentSecond: number = $state(Math.round(elapsed / 1000));
  let currentProgress: number = $state(100 - (elapsed / duration) * 100);

  let frame;
  if (browser) {
    let lastTime: number = window.performance.now();

    (function update() {
      frame = requestAnimationFrame(update);

      const time = window.performance.now();

      elapsed = Math.min(time - lastTime + elapsed, time);

      currentSecond = Math.round((duration - elapsed) / 1000);

      currentProgress = 100 - (elapsed / duration) * 100;

      lastTime = time;

      if (elapsed >= duration) {
        cancelAnimationFrame(frame);
      }
    })();
  }
</script>

<div class="mx-auto flex-row content-center object-center" id="countdown">
  <div class="radial-progress" style="--value:{currentProgress};" role="progressbar">
    <span class="countdown font-mono text-sm lg:text-2xl">
      <span style="--value:{currentSecond}"></span>
    </span>
  </div>
</div>
