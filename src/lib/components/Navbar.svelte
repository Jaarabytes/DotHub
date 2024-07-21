<script>
  let navItems = [
    { name: 'Login', route: '/login' },
    { name: 'Donate', route: '/donate' }
  ];
</script>

<nav>
  <div class="navbar">
    <div class="navbar-brand">
      <a href="/" class="font-bold">Procastimate</a>
    </div>
    <div class="navbar-menu">
      {#each navItems as item}
        <a href={item.route} class="rounded-xl mx-2 px-3 py-2 hover:bg-gray-400">{item.name}</a>
      {/each}
    </div>
  </div>
</nav>

<style>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f8f9fa;
  }

  .navbar-brand a {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    text-decoration: none;
  }

  .navbar-menu {
    display: flex;
    gap: 1rem;
  }

  .navbar-menu a {
    color: #333;
    text-decoration: none;
  }

</style>
