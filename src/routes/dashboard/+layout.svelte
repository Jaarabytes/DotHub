<script lang='ts'>
  import Sidenav from "$lib/components/Sidenav.svelte";
</script>

<div class="flex h-screen flex-col md:flex-row md:overflow-hidden">
  <Sidenav />
  <div class="flex-grow p-6 md:overflow-y-auto md:p-12">
    <slot />
  </div>
</div>
