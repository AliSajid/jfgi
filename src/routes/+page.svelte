<script lang="ts">
  import Reprimand from '$lib/components/Reprimand.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const siteName = data.siteName;
</script>

<svelte:head>
  <title>
    {siteName} -- Home Page
  </title>
</svelte:head>

<Reprimand />
