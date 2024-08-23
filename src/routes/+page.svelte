<script>
  // implement pagination
  // github isssues, select field should be added (users select their specific requirements and db is filtered through it)
  // also, help page to install all configs (link this to a button that says i don't know)
  // my repo & dotfiles should be pinned (alongside github issues)
  import { Github } from 'lucide-svelte';

  const repos = [{
    owner: "lewagon",
    github_url: "https://github.com/lewagon/dotfiles",
    description: "Default configuration for Le Wagon's students",
    stars: 20365,
    last_updated: "2024-08-22T11:20:42Z",
    tech_stack: ["zsh", "tmux", "nvim"]
  },
  {
    owner: "lewagon",
    github_url: "https://github.com/lewagon/dotfiles",
    description: "Default configuration for Le Wagon's students",
    stars: 20365,
    last_updated: "2024-08-22T11:20:42Z",
    tech_stack: ["zsh", "tmux", "nvim"]
  }]


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

</script>

<svelte:head>
  <title>Dotfilia</title>
</svelte:head>

 <header class="sticky top-0 z-10 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl">
    <div class="max-w-5xl mx-auto p-3 flex items-center justify-between">
      <a
        href="/"
        class="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tighter"
      >
        DotHub
      </a>

      <div>
        <a
          href="https://github.com/jaarabytes/dothub"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center space-x-1 py-1 px-2 text-xs font-medium text-stone-500 dark:text-stone-400 border border-stone-300 dark:border-stone-600 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 transition-colors"
        >
          <Github />
          <span>Star</span>
        </a>
      </div>
    </div>
</header>


<section class="flex flex-col px-3 py-8 space-y-2 text-pretty md:text-center md:mx-auto md:max-w-[28rem]">
  <h1 class="font-semibold tracking-tight text-3xl md:text-4xl text-stone-900 dark:text-stone-100">
    Discover the best <span class="inline-block">dotfiles</span>
  </h1>
  <h2 class="text-stone-500 dark:text-stone-400">
    DotHub is a place to find, sort and steal the best dotfiles you can get. Make your system look and feel better !
  </h2>
</section>

<main>
{#each repos as repo}
<a
      href={repo.github_url}
      target="_blank"
      rel="noopener noreferrer"
      class="bg-stone-50 dark:bg-stone-800 p-3 border border-stone-200 dark:border-stone-700 rounded-md flex flex-col block hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
    >
      <h3 class="font-semibold text-stone-900 dark:text-stone-100 mb-1 hover:underline break-words">
        {repo.owner}
      </h3>
      {#if repo.description}
        <p class="text-sm text-stone-700 dark:text-stone-300 mb-2 break-words">
            {repo.description.length > 120
            ? repo.description.slice(0, 120) + "..."
            : repo.description}
        </p>
      {:else}
        <p class="text-sm text-stone-700 dark:text-stone-300 mb-2 break-words">
          No description provided
        </p>
      {/if}

    <div class="grow" />
      {#if repo.tech_stack}
        <div class="flex flex-wrap gap-1 items-center">
            <span class="text-sm text-stone-500 dark:text-stone-400">
                Stack:
            </span>
            {#each repo.tech_stack.slice(0, 5) as stack}
                <span class="p-0.5 bg-[#eeedec] text-stone-500 dark:bg-[#363230] dark:text-stone-400 rounded-sm text-xs inline-block">
                    {stack}
                </span>
            {/each}
            {#if repo.tech_stack.length > 5}
                <span class="flex text-sm text-stone-500 dark:text-stone-400 grow">
                    <div class="grow flex flex-col pr-3">
                        <div class="h-1/2 border-b border-stone-200 dark:border-stone-700" />
                        <div class="h-1/2 border-t border-stone-200 dark:border-stone-700" />
                    </div>
                    +{repo.tech_stack.length - 5} more
                </span>
            {/if}
        </div>
      {/if}

        <div class="flex">
          <span class="text-sm text-stone-500 dark:text-stone-400">Stars</span>
            <div class="grow flex flex-col px-3">
              <div class="h-1/2 border-b border-stone-200 dark:border-stone-700" />
              <div class="h-1/2 border-t border-stone-200 dark:border-stone-700" />
            </div>
          <span class="text-sm text-stone-500 dark:text-stone-400">{formatNumberK(repo.stars)}</span>
        </div>

        <div class="flex">
          <span class="text-sm text-stone-500 dark:text-stone-400">Last Commit</span>
            <div class="grow flex flex-col px-3">
              <div class="h-1/2 border-b border-stone-200 dark:border-stone-700" />
              <div class="h-1/2 border-t border-stone-200 dark:border-stone-700" />
            </div>
          <span class="text-sm text-stone-500 dark:text-stone-400">{timeAgo(Number(repo.last_updated))}</span>
        </div>
    </a>
{/each}
</main>

<footer class="flex max-w-5xl mx-auto px-3 mb-6 space-x-4 items-center">
  <div class="grow flex flex-col">
    <div class="h-1/2 border-b border-stone-100 dark:border-stone-800" />
    <div class="h-1/2 border-t border-stone-100 dark:border-stone-800" />
  </div>
  <p class="text-stone-400 dark:text-stone-500 text-sm">
    dotHub by 
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://x.com/jaarabytes"
      class="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
    >
      @jaarabytes
    </a>
  </p>
</footer>
