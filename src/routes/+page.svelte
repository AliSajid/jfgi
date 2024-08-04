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
  <meta
    name="description"
    content="{siteName} Home Page -- politely* tell people to Google things first"
  />
  <meta name="charset" content="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="nositelinkssearchbox" />
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <meta name="author" content="Ali Sajid Imami" />
</svelte:head>

<Reprimand />
