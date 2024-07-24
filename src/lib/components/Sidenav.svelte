<script lang="ts">
  import "../../app.css"
  import { Power } from "lucide-svelte";
  import { House } from "lucide-svelte";
  import { HandHelping } from "lucide-svelte";
  import { UserPen } from "lucide-svelte";
    import Donate from "./Donate.svelte";
  // add the sign out div
  const navlinks = [{name: "Home", link: "/", icon: House},{name: "Donate", link: "/donate", icon: HandHelping},{name: "Profile", link: "/profile", icon: UserPen}]
</script>
<div class="w-full flex-none md:w-64 bg-gray-100">
    <a href={`/dashboard/`}>
      <div class="bg-white text-black bg-gray-100 m-2 rounded-lg p-3 hover:bg-violet-800 hover:text-white">
        <House class='h-6 w-6 inline mx-2' />
      <p class='inline'>Home</p>
    </div>
  </a>
    <a href={`/dashboard/donate`}>
      <div class="bg-white text-black bg-gray-100 m-2 rounded-lg p-3 hover:bg-violet-800 hover:text-white">
        <HandHelping class='h-6 w-6 inline mx-2' />
      <p class='inline'>Donate</p>
    </div>
  </a>
    <a href={`/dashboard/profile`}>
      <div class="bg-white text-black bg-gray-100 m-2 rounded-lg p-3 hover:bg-violet-800 hover:text-white">
        <UserPen class='h-6 w-6 inline mx-2' />
      <p class="inline">Profile</p>
    </div>
  </a>

  <div class='hidden h-auto w-full grow rounded-md bg-gray-50 md:block'></div>

     <div class="bg-white text-black bg-gray-100 m-2 rounded-lg p-3 hover:bg-red-600 hover:text-white">
       <Power class='h-6 w-6 inline mx-2' />     
      <p class="inline">Sign out</p>
  </div>
</div>
