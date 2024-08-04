<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import CountdownTimer from '$lib/components/CountdownTimer.svelte';
  import type { PageData } from '../$types';

  export let data: PageData;

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
</svelte:head>

<CountdownTimer {timer} />
<div class="flex-row content-center object-center">
  <div class="flex justify-center p-4">
    <h1 class="text-sm font-extralight md:text-xl lg:text-3xl">
      Searching Google for <code>{mySearchQuery}</code>
    </h1>
  </div>
</div>
