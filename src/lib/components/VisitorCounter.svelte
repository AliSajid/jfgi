<script lang="ts" type="module">
  import type { Counter } from '$lib/types/Counter';
  import { suffixes } from '$lib/suffixes';
  export let count: Counter;

  // Extract the visitor count from the Counter object passed in;
  const visitorCount = count.count;

  // Split the visitor count into an array of digits;
  const formattedCount = visitorCount.toLocaleString();

  // Get a random message from suffixes
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
</script>

<div class="divider"></div>
<div class="mx-auto flex-row content-center" id="visitorcounter">
  <div class="badge badge-ghost badge-lg m-2">
    {formattedCount}
    {suffix.adjective}
    {visitorCount === 1 ? suffix.noun.singular : suffix.noun.plural}
    {suffix.verb}
  </div>
  <footer class="footer footer-center m-2">
    <p class="footer-center inline place-content-center p-4 font-mono text-xs">
      Made with <span class="text-red-500">❤️</span> by
      <a class="link link-info" href="https://github.com/AliSajid" target="_blank" rel="noopener"
        >Ali Sajid Imami</a
      >
    </p>
  </footer>
</div>
