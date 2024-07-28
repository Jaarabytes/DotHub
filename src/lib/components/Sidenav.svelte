<script lang="ts">
    import { signOut } from "@auth/sveltekit/client";
  import "../../app.css"
  import { Bean, Power, House, HandHelping, UserPen } from "lucide-svelte";

  const handleSignOut = () => {
  signOut();
  }
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

     <button on:click={handleSignOut} class="bg-white text-black bg-gray-100 m-2 rounded-lg p-3 hover:bg-red-600 hover:text-white">
       <Power class='h-6 w-6 inline mx-2' />     
      <p class="inline">Sign out</p>
  </button>
</div>
