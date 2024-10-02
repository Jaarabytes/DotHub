<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import "../app.css"

/**
 * HTTP DOG 
 * When web app encounters 401, 403, 404 or 500 error, specific dog images are displayed
 */

  let dogImage: string = ''

  onMount(() => {
  if ( $page.status === 401 || $page.status === 403 || $page.status === 404 ||  $page.status === 500 ) {
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
