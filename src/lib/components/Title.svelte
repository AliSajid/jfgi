<!--
SPDX-FileCopyrightText: 2022 - 2024 Ali Sajid Imami

SPDX-License-Identifier: MIT
-->

<script lang="ts">
  interface Props {
    title: string;
  }

  let { title }: Props = $props();
</script>

<div class="m-4 flex flex-row justify-center p-4">
  <h1 class="font-serif text-xl font-bold md:text-3xl lg:text-5xl">{title}</h1>
</div>
