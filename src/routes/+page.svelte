<script lang="ts">
import { goto } from "$app/navigation";
import { page } from "$app/stores";

export let data;

const { repositories, totalPages, totalRepositories } = data;
let currentPage: number = data.currentPage
let dotfiles = $page.data.dotfiles;
let selectedDotfiles:string[] = [];

function toggleDotfiles(dotfile: string) {
  selectedDotfiles = selectedDotfiles.includes(dotfile)
    ? selectedDotfiles.filter(d => d !== dotfile)
    : [...selectedDotfiles, dotfile];
}

function goToPage(page: number) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set('page', page.toString());
  window.location.search = searchParams.toString();
}

/**
 * 81930 -> 81.9k
 * 1000 -> 1.0k
 * 999 -> 999
 *
 * @param {number} num - The number to format.
 * @returns {string} - Formatted number as a string.
 */
function formatNumberK (num: number) {
  if (num < 1000) return num.toString();
  const thousands = num / 1000;
  return (Math.floor(thousands * 10) / 10).toFixed(1) + "k";
};

/**
 * @param {string} dateString
 * @returns {string} - Human-readable time difference.
 */
function timeAgo (dateString: string) {
  const targetDate = new Date(dateString);
  const targetUnixSecond = targetDate.getTime() / 1000;
  const currentUnixSecond = (new Date()).getTime() / 1000;
  const diff = currentUnixSecond - targetUnixSecond;
  const intervals = [
    { label: "yr", seconds: 31536000 },
    { label: "wk", seconds: 604800 },
    { label: "d", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "min", seconds: 60 },
    { label: "sec", seconds: 1 },
  ];
  for (let i = 0; i < intervals.length; i++) {
    const count = Math.floor(diff / intervals[i].seconds);
    if (count > 0) {
      return `${count}${intervals[i].label} ago`;
    }
  }
  return "just now";
};

function getDotfiles () {
  const params = new URLSearchParams();
  selectedDotfiles.forEach(dotfile => params.append('dotfiles', dotfile));
  goto(`?${params.toString()}`).then(() => location.reload());
}

</script>

<svelte:head>
  <title>DotHub</title>
</svelte:head>

<main class="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
  <header class="bg-blue-600 dark:bg-blue-800 text-white py-4 transition-colors duration-300">
    <div class="container mx-auto px-4 flex justify-between items-center">
      <a href="/" target="_blank" ><h1 class="text-3xl font-bold">Dot<span class="bg-gray-800 rounded-lg px-2">Hub</span></h1></a>
      <a href='https://github.com/jaarabytes/dothub' target="_blank">
      <button 
        class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> Star
      </button>
      </a>
    </div>
  </header>

    <div class="container mx-auto px-4 py-8">
      <h2 class="text-stone-500 dark:text-stone-400">
        DotHub is a place to find, sort and steal the best dotfiles you can get. Make your system look and feel better !
      </h2>
      <div class="mb-6">
        <h2 class="font-medium text-stone-500 dark:text-stone-400 mb-2">Filter by categories (total repositories : {totalRepositories}):</h2>
        <div class="flex flex-wrap gap-2">
          {#each dotfiles as dotfile}
            <button
              on:click={() => toggleDotfiles(dotfile.name)}
              class="px-3 py-1 rounded-full text-sm font-medium
                     {selectedDotfiles.includes(dotfile.name)
                       ? 'bg-blue-500 text-white'
                       : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
                     hover:bg-blue-600 hover:text-white transition-colors duration-300"
            >
              {dotfile.name}
            </button>
          {/each}
        </div>
        <button 
          class="text-white px-4 py-2 my-5 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          on:click={getDotfiles}>Get em
        </button>
        </div>


  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {#each repositories as repository}
     <a
        href={repository.url}
        target="_blank"
        rel="noopener noreferrer"
        class="transition-colors bg-white dark:bg-gray-800 opacity-[.75] hover:opacity-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
        <div>
          <a href={repository.url} class='hover:underline text-white' target="_blank">
            <h2 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{repository.owner}</h2>
          </a>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{repository.description === 'null' ? 'No description provided' : repository.description}</p>
          <span class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
            ⭐ {formatNumberK(repository.stars)}
          </span>
          <span class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
            {timeAgo(repository.last_updated)}
          </span>
        </div>
      </a>
      {/each}
    </div>

    <div class="mt-8 flex justify-between items-center">
      <button
        on:click={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="text-gray-700 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <button
        on:click={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>

  <footer class="bg-gray-200 dark:bg-gray-800 py-4 mt-8 transition-colors duration-300">
    <div class="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
      Dothub by
      <a href="https://x.com/jaarabytes" target="_blank">@jaarabytes</a>
    </div>
  </footer>
</main>
