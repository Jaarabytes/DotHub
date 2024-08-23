<script>
  import { Github } from "lucide-svelte"

  export let data;

  let projects = data.projects;
  let categories = [...new Set(projects.map(p => p.category))];
  let selectedCategories = [];
  let currentPage = 1;
  let itemsPerPage = 15;

  $: filteredProjects = selectedCategories.length === 0
    ? projects
    : projects.filter(p => selectedCategories.includes(p.category));

  $: paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  $: totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  function toggleCategory(category) {
    selectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    currentPage = 1; // Reset to first page when changing filters
  }

// implement pagination
function nextPage() {
  if (currentPage < totalPages) currentPage++;
}

function prevPage() {
  if (currentPage > 1) currentPage--;
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
 * @param {number} unixSecond
 * @returns {string} - Human-readable time difference.
 */
const timeAgo = (unixSecond) => {
  const moment = (new Date()).getTime() / 1000;
  const diff = moment - unixSecond;
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

<main class="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
  <header class="bg-blue-600 dark:bg-blue-800 text-white py-4 transition-colors duration-300">
    <div class="container mx-auto px-4 flex justify-between items-center">
      <a href="https://dothub.vercel.app" target="_blank" ><h1 class="text-3xl font-bold">DotHub</h1></a>
      <a href='https://github.com/jaarabytes/dothub' target="_blank">
      <button 
        class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
      >
        <Github class="h-4 w-4 inline"/>
      </button>
      </a>
    </div>
  </header>

  <div class="container mx-auto px-4 py-8">
    <h2 class="text-stone-500 dark:text-stone-400">
      DotHub is a place to find, sort and steal the best dotfiles you can get. Make your system look and feel better !
    </h2>
    <div class="mb-6">
      <h2 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by categories:</h2>
      <div class="flex flex-wrap gap-2">
        {#each categories as category}
          <button
            on:click={() => toggleCategory(category)}
            class="px-3 py-1 rounded-full text-sm font-medium
                   {selectedCategories.includes(category)
                     ? 'bg-blue-500 text-white'
                     : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
                   hover:bg-blue-600 hover:text-white transition-colors duration-300"
          >
            {category}
          </button>
        {/each}
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each paginatedProjects as project}
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{project.name}</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
          <span class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
            {project.category}
          </span>
        </div>
      {/each}
    </div>

    <div class="mt-8 flex justify-between items-center">
      <button
        on:click={prevPage}
        disabled={currentPage === 1}
        class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="text-gray-700 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <button
        on:click={nextPage}
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
