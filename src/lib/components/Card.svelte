<script lang="ts">
  import '../../app.css';


  export let title: string = '';
  export let value: string = "";
</script>

<div class="rounded-lg w-full p-1 bg-slate-100 m-2">
      <h3 class="p-2 font-bold">{title}</h3>
  <div class="bg-white rounded-lg">
      <p class="p-2 text-lg font-bold">{value}</p>
  </div>
</div>
