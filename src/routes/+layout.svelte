<!--
SPDX-FileCopyrightText: 2022 - 2024 Ali Sajid Imami

SPDX-License-Identifier: MIT
-->

<script lang="ts" module>
  import { getPerformance } from 'firebase/performance';
  import { getAnalytics } from 'firebase/analytics';
  import { app } from '$lib/firebase';
  import { browser } from '$app/environment';

  if (browser) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const performance = getPerformance(app);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const analytics = getAnalytics(app);
  }
</script>

<script lang="ts">
  import '../app.css';
  import Title from '$lib/components/Title.svelte';
  import Image from '$lib/components/Image.svelte';
  import VisitorCounter from '$lib/components/VisitorCounter.svelte';

  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: import('svelte').Snippet;
  }

  let { data, children }: Props = $props();

  let visitorCount = data.count;
  let title = data.siteName;
</script>

<div class="flex size-full h-screen flex-col">
  <Title {title} />
  <Image />
  {@render children?.()}
  <VisitorCounter count={visitorCount} />
</div>
