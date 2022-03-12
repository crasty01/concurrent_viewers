<script lang="ts">
import Bar from "$/components/bar.svelte";
import { fetchData } from "$/lib/fetch";

  import { onDestroy, onMount } from "svelte";
  const TIMER = 60 * 1000; // 3 * 1000;
  
  export let account: string;

  let currentCount;
  let previousCount;
  let timer;
  const update_bar = (current :number ,last :number) =>{
    previousCount = last
    currentCount = current
  } 
  // $: Targetpercentage = 80
  onMount(async () => {
    const data = await fetchData(account);
    update_bar(data.current.average, data.last.average);
    timer = setInterval(async () => {
      const data = await fetchData(account);
      update_bar(data.current.average, data.last.average);
    }, TIMER);
  });

  onDestroy(() => {
    clearInterval(timer);
  });
</script>

<div class="obs-overrideable" >
    <Bar current={currentCount} target={previousCount}></Bar>
</div>
