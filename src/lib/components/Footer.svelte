<script lang="ts">
    import "../../app.css"
     import FaTwitter from 'svelte-icons/fa/FaTwitter.svelte'
    import FaGithub from 'svelte-icons/fa/FaGithub.svelte'
    import FaMailBulk from 'svelte-icons/fa/FaMailBulk.svelte'
</script>

<footer class="p-10 m-5 flex justify-between">
  <div class="">
    <p class="text-gray-700">© 2024 ProcastiMate.</p>
  </div>
  <div class="flex justify-between">
    <div class='w-6 h-6 mx-3'>
        <a href="https://x.com/jaarabytes"><FaTwitter /></a>
    </div>

    <div class='w-6 h-6 mx-3'>
        <a href="https://github.com/jaarabytes"><FaGithub /></a>
    </div>

    <div class='w-6 h-6 mx-3'>
        <a href="mailto:xh3rking96@gmail.com"><FaMailBulk /></a>
    </div>
  </div>
</footer>
