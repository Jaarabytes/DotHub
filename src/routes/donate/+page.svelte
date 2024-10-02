<script>
  import { onMount } from "svelte";

  let amount = ''
  function payWithPaystack () {
    let handler = PaystackPop.setup({
      key: "pk_live_9999378c83331abc0c642f96d2457a5f88969934",
      email: 'xh3rking96@gmail.com',
      amount: Number(amount) * 100,
      currency: "KES",
      callback: function() {
        alert("Thank you so much!!!");
      },
      onClose: function () {
        alert("NOOO, not yet!!!")
      }
    });

    handler.openIframe();
  }

  onMount(() => {
    const script= document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js'
    document.head.appendChild(script);
  })
</script>

<main class='my-5'>
  <h1 class='font-extrabold text-center text-3xl'>Be blessed!!!</h1>
  <form class="text-center my-3" >
    <label for='amount' class='text-center'>Amount (in Kenyan Shillings)</label><br /> <br />
    <input bind:value={amount} class='text-center rounded-lg text-black py-2 px-3 border-2 border-black' required /><br /><br />
    <button class="bg-green-900 px-3 py-2 rounded-lg text-white hover:bg-green-700" type='button' on:click={payWithPaystack}>Donate</button>
  </form>
  <p class='text-center my-5'>Thank you <a class='font-bold' href='https://paystack.com'>Paystack</a></p>
</main>
