<script>
import { Github } from "lucide-svelte"

export let data; // This should contain all data passed from `+page.server.js`export let data;

console.log(`Repositories are`, data.repositories);
console.log(`Total Repositories are`, data.totalRepositories);
console.log(`Total Pages are`, data.totalPages);
console.log(`Current Page is`, data.currentPage);
console.log(`Dotfiles frontend are: `, data.dotfiles);

const repositories = data.repositories;
const totalPages = data.totalPages;
const totalRepositories = data.totalRepositories;
let currentPage = data.currentPage || 1;
const dotfiles = data.dotfiles;

let selectedDotfiles = [];
console.log(`selected Dotfiles include ${selectedDotfiles}`);

function toggleDotfiles(dotfile) {
  selectedDotfiles = selectedDotfiles.includes(dotfile)
    ? selectedDotfiles.filter(d => d !== dotfile)
    : [...selectedDotfiles, dotfile];
}
function goToPage(page) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set('page', page);
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
const formatNumberK = (num) => {
  if (num < 1000) return num.toString();
  const thousands = num / 1000;
  return (Math.floor(thousands * 10) / 10).toFixed(1) + "k";
};

/**
 * @param {string} dateString
 * @returns {string} - Human-readable time difference.
 */
const timeAgo = (dateString) => {
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


// might use it in the future
let darkMode = false;
function toggleDarkMode() {
  darkMode = !darkMode;
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
</script>

<svelte:head>
  <title>DotHub</title>
</svelte:head>

<main class="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
  <header class="bg-blue-600 dark:bg-blue-800 text-white py-4 transition-colors duration-300">
    <div class="container mx-auto px-4 flex justify-between items-center">
      <a href="https://dothub.vercel.app" target="_blank" ><h1 class="text-3xl font-bold">Dot<span class="bg-gray-800 rounded-lg px-2">Hub</span></h1></a>
      <a href='https://github.com/jaarabytes/dothub' target="_blank">
      <button 
        class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
      >
        <Github class="h-4 w-4 inline"/> Star
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
      </div>


    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each repositories as repository}
     <a
        href={repository.github_url}
        target="_blank"
        rel="noopener noreferrer"
        class="transition-colors bg-white dark:bg-gray-800 opacity-[.80] hover:opacity-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
        <div>
          <a href={repository.github_url} class='hover:underline text-white' target="_blank">
            <h2 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{repository.owner}</h2>
          </a>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{repository.description}</p>
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
