<script lang="ts">
import FaHome from 'svelte-icons/fa/FaHome.svelte'
import FaHandHoldingHeart from 'svelte-icons/fa/FaHandHoldingHeart.svelte'
import FaChild from 'svelte-icons/fa/FaChild.svelte'
 import "../../app.css"
</script>

<div>

<div>
  <a href="/">
    <div>
      <div class="w-6 h-6 inline">
          <fahome />
      </div>
      home
    </div>
  </a>

  <a href="/donate" ><div>
    <div class="w-6 h-6 inline">
      <FaHandHoldingHeart />
    </div>
    Donate
    </div>
  </a>

  <a href="/profile">
   <div>
    <div class="w-6 h-6 inline">
      <FaChild />
    </div>
      Profile
     </div>
  </a>


</div>

<div>
  <a href="/">
    <div>
      <div class="w-6 h-6 inline">
          <fahome />
      </div>
      home
    </div>
  </a>
</div>

</div>
