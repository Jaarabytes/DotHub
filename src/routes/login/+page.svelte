<script lang='ts'>
  import "../../app.css"
  import { enhance } from "$app/forms";
  export let form;
</script>

<div class="w-96 mx-auto">
<form method="POST" use:enhance class="bg-gray-100 my-5 p-5 rounded-lg">
<h3 class="font-bold text-2xl my-5">Please Login to continue</h3>
  <label for='email'>Email: </label><br />
  <input class="w-full rounded-lg text-black border-2 border-slate-300 p-2" name="email" id='email' placeholder='Enter your email address' type='email' required /><br /><br />
  <label for='password'>Password: </label><br />
  <input id="password" name="password" class="w-full rounded-lg text-black border-2 border-slate-300 p-2" placeholder='Enter your password' type='password' required /><br /><br />
  <button class="text-white text-left px-4 rounded-lg bg-violet-800 hover:bg-violet-600 w-full py-3" type='submit'>Log in</button>
 
    {#if form?.error}
      <p class="text-red-600 font-bold error text-center">{form.error}</p>
    {/if}
  <p>Don't have an account? <a href="/sign_up">Sign up </a></p>
</form>


</div>
