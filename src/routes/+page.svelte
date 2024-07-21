<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import "../app.css"
  import Footer from "$lib/components/Footer.svelte";
  import Pricing from "$lib/components/Pricing.svelte";
  import FaQs from "$lib/components/FAQs.svelte";
  import FaSeedling from 'svelte-icons/fa/FaSeedling.svelte'

// create a count function that chooses a random number from 1-20

const reviews = [
{name: "Sarah, University Student", review: `"Mood and life improved. I can't say thank you enough!"`},
{name: "James, father of 2", review: `"Ironically, my productivity increased after using this app. Hihly recommend it"`},
{name: "Herbert, Frontend developer at Streamwan technologies", review: `"Stress reduced, indeed procastination is key!"`}
]
</script>

<svelte:head>
  <title>ProcastiMate</title>
</svelte:head>

<Navbar />
<main>
  <div class="text-center my-10">
    <h1 class="lg:text-[50px] my-5 text-center text-[45px] font-extrabold ">Sweeten the NOW !</h1>
    <p class="text-center text-xl">Reduce your stress, and push deadlines further</p>
  </div>

  <div class="text-center my-10">
    <a href="/sign_up"><button class="rounded-lg m-3 text-xl px-5 py-3 bg-violet-800 text-white hover:bg-violet-600">
        Get ProcastiMate
        <div class="w-5 h-5 inline-block">
            <FaSeedling /> 
        </div>
      </button></a>
    <p class="text-xs"><span class="text-green-500 font-bold">$20 off</span> for the first 100 customers ( count left )</p>
  </div>

  <div class="my-6">
    <p class="text-center">No need for Virtual Assistants, We help you <span class="font-bold">procastinate</span> your tasks more efficiently. </p>
  </div>

  <div class="px-3 my-13 md:text-center">
    <h2 class="my-7 font-extrabold lg:text-[30px] text-2xl ">But procastination is bad ...</h2>
    <h1 class="my-5 text-xl font-bold">Perfection is our buddy</h1>
    <p class="text-sm my-5">Good enough is better than best, and faster too!</p>
    
    <h1 class="my-7 text-xl font-bold">Delay gratification, enjoy life!</h1>
    <p class="my-5 text-sm">Postpone tasks, savor the small wins and everyday pleasures</p>

    <h1 class="my-7 text-xl font-bold">Deadline detox</h1>
    <p class="my-5 text-sm">Embrace the art of putting things off</p>

    <h1 class="my-7 text-xl font-bold">Tick Tock Tomorrow!</h1>
    <p class="my-5 text-sm">Why rush when you can relax today and enjoy tomorrow</p>

  </div>

  <h2 class="font-bold text-center my-10 text-2xl">ProcastiMate is trusted all over Kenya and beyond</h2>
  <hr />
  <div class="sm:flex sm:justify-center mt-10">
    {#each reviews as review}
      <div class="mx-5 p-5">
        <p class="sm:text-lg text-xl ">{review.review}</p>
        <h4 class="my-4">{review.name}</h4>
      </div>
    {/each}
  </div>
</main>
<Pricing />
<FaQs />
<Footer />
