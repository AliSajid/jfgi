<!--
SPDX-FileCopyrightText: 2022 - 2024 Ali Sajid Imami

SPDX-License-Identifier: MIT
-->

<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import CountdownTimer from '$lib/components/CountdownTimer.svelte';
  import type { PageData } from '../$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let timer = 20;

  let mySearchQuery = $page.params.query;

  setTimeout(() => {
    if (browser) {
      performance.mark('redirecting to google');
      window.location.href = `https://www.google.com/search?q=${mySearchQuery}`;
    }
  }, timer * 1000);

  let title = data.siteName;
</script>

<svelte:head>
  <title>
    {title} -- Searching for {mySearchQuery}
  </title>
  <meta
    name="description"
    content="{data.siteName} Search Page -- politely* telling people to Google things first"
  />
  <meta name="charset" content="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="nositelinkssearchbox" />
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <meta name="author" content="Ali Sajid Imami" />
</svelte:head>

<CountdownTimer {timer} />
<div class="flex-row content-center object-center">
  <div class="flex justify-center p-4">
    <h1 class="text-sm font-extralight md:text-xl lg:text-3xl">
      Searching Google for <code>{mySearchQuery}</code>
    </h1>
  </div>
</div>
