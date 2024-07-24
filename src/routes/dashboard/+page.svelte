<script lang="ts">
    import { enhance } from "$app/forms";
  import { spring } from "svelte/motion";
    import Layout from "../+layout.svelte";
    // use tippy js (for tooltips)
    // add those charts like in wakatime
</script>

<main>
  <p>Insert quote here</p>

  <h1 class="font-bold md:text-[40px] text-3xl">Let's delay some deadlines!</h1>

  <form method="POST" use:enhance>
    <label for='text'>New Task? </label>
    <input type='text' class="text-black rounded-lg border-slate-500 border-2" required />
  </form>
</main>
