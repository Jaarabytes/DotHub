<script lang="ts">
  import "../../app.css"
  import { Github, Twitter, Send } from "lucide-svelte"
</script>

<footer class="md:px-[20%] p-10 m-5 flex justify-between">
  <div class="">
    <p class="text-gray-700">© 2024 ProcastiMate.</p>
  </div>
  <div class="flex justify-between">
    <div class='w-6 h-6 mx-3'>
        <a href="https://x.com/jaarabytes"><Twitter /></a>
    </div>

    <div class='w-6 h-6 mx-3'>
        <a href="https://github.com/jaarabytes"><Github /></a>
    </div>

    <div class='w-6 h-6 mx-3'>
        <a href="mailto:xh3rking96@gmail.com"><Send /></a>
    </div>
  </div>
</footer>
