<script lang="ts">
import { PartyPopper, Handshake } from "lucide-svelte";

</script>
<h1 class="mt-10 lg:text-[45px] text-3xl text-center font-extrabold">Pricing</h1>
<div class="md:flex md:justify-center my-10">
  <div class="m-5 p-5 rounded-lg border-2">
    <h1 class="font-bold text-3xl">Starter</h1>
    <p class="text-xl mb-5"><s>$50</s><span class="ml-4 font-extrabold">$70</span> USD<p>
    <p>Reduced stress</p> 
    <p>Increased creativity</p> 
    <p>Better time management</p> 
    <p class="text-gray-700"><s>Personalized plan</s></p>
    <p class="text-gray-700"><s>Priority pusher</s></p>
    <p class="text-gray-700"><s>Deadline Delayer</s></p>
    <a href='/sign_up'><button class="my-5 text-white rounded-lg px-5 py-3 bg-violet-800 hover:bg-violet-600">Get Procastimate<PartyPopper class='px-1 inline' /></button></a>
    <p>Pay once, relieved for a lifetime</p>
  </div>


 <div class="m-5 p-5 rounded-lg border-4 border-violet-700">
    <h1 class="font-bold text-3xl">Premium</h1>
    <p class="text-xl mb-5"><s>$70</s><span class="ml-4 font-extrabold">$120</span> USD<p>
    <p>Reduced stress</p>
    <p>Increased creativity</p> 
    <p>Better time management</p> 
    <p>Anti-urgency mode</p>
    <p>Personalized plan</p>
    <p>Deadline delayer</p>
    <p>Life coaching</p>
    <p>Progress tracker</p>
    <a href="/sign_up"><button class="my-5 text-white rounded-lg px-5 py-3 bg-violet-800 hover:bg-violet-600">Get Procastimate<Handshake class='px-1 inline' /></button></a>
    <p>Pay once, relieved for a lifetime</p>
  </div>
</div>
