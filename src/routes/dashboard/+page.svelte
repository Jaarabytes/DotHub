<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import { onMount } from "svelte";
    import { Check } from "lucide-svelte";
    import { Trash2 } from "lucide-svelte";
    import { enhance } from "$app/forms";
    import { spring } from "svelte/motion";
    import Layout from "../+layout.svelte";
    // use tippy js (for tooltips)
    // add those charts like in wakatime

    let greeting = 'Habari yako';
    const tasks = ["Attend an X space", "Build Shit", "Be dangerous", "BE IT!"]
    onMount(() => {
    const currentTime = new Date();
    const hours = currentTime.getHours();

    if ( hours < 12 ) {
    greeting = "Good morning!"
    }
    else if ( hours < 16 ) {
    greeting = "Good afternoon!"
    }
    else if ( hours < 21 ) {
    greeting = "Good evening!"
    }
    else {
    greeting = "Good night"
    }
    })
</script>

<main>
  <p class="text-xl font-bold">{greeting}</p>
  <div class="flex">
    <Card title="Total tasks" value="0" />
    <Card title="Completed" value="0" />
    <Card title="Deleted" value="0" />
  </div>

  <div class="my-7">
    <h2 class='text-2xl font-bold'>New Duty? </h2><br />
    <input placeholder="New Task?" class="border border-gray-500 text-black rounded-lg px-3 py-2" />
    <button class="text-white rounded-lg bg-violet-800 px-3 py-2">Add Task</button>
  </div>

<div class="flex">
  <div class="mr-5 w-full bg-gray-100 rounded-lg p-2">
    <h2 class="font-bold my-3 text-xl">Tasks to do:</h2>
    {#each tasks as task}
      <div class="bg-white p-3 flex">
        <div>
          <input type="checkbox" >
          <p class="inline mx-3">{task}</p>
        </div>
          <div class="flex justify-end">
        <button class="bg-red-800 rounded-lg p-1 text-white mx-2"><Trash2 class='h-6 w-6' /></button>
        </div>
      </div>
      <hr />
    {/each}
  </div>

  <div class="mr-5 w-full bg-gray-100 rounded-lg p-2">
    <h2 class="font-bold my-3 text-xl">Tasks done:</h2>
    {#each tasks as task}
      <div class="bg-white p-3 flex">
          <input type="checkbox" checked>
          <s class="inline mx-3 text-gray-500">{task}</s>
        <div class="flex justify-end">
          <button class="bg-red-800 rounded-lg p-1 text-white mx-2"><Trash2 class='h-6 w-6' /></button>
        </div>
      </div>
      <hr />
    {/each}
  </div>
</div>
</main>
