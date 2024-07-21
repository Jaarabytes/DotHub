<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  // import app.css
  // Fix this please

  // yes, who doesn't love dogs
  let dogImage = ''

  onMount(() => {
  if ( $page.status === 401 || $page.status === 404 || $page.status === 403 ||  $page.status === 500 ) {
  // showcase the http dog whenever an error occurs, hell yeah

  dogImage = `https://http.dog/${$page.status}.jpg`
  }
  })
</script>

<svelte:head>
  <title> {$page.status}: {$page.error?.message}</title>
</svelte:head>

<main>
  {#if dogImage}
    <a href="/"><img src={dogImage} alt={$page.error?.message} class='mx-auto'></a>
  {:else}
    <h3 class='text-center my-5 font-extrabold'>An error occured. Please go <a href="/">HOME</a></h3>
  {/if}
</main>
