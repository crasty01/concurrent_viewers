<script lang="ts">
  
  import { onDestroy, onMount } from "svelte";
  import Bar from "$/components/bar.svelte";
  import { fetchData } from "./lib/fetch";
  
  const TIMER = 30 * 60 * 1000; // 3 * 1000;
  let timer = null
  $: previousCount = 0
  $: currentCount = 0

  const update_bar = async (current :number ,last :number) =>{
    previousCount = last
    currentCount = current
  } 
   // $: Targetpercentage = 80
   onMount(async () => {

    const data = await fetchData("cdubya719");
    await update_bar(data.current.average,data.last.average)
    timer = setInterval(async () => { 
      const data = await fetchData("cdubya719");
      await update_bar(data.current.average,data.last.average)
    }, TIMER);
  });

  onDestroy(() => {
    clearInterval(timer);
  });

</script>
<h1> Live count </h1>
<Bar current={currentCount} target={previousCount}/>
<h1> Static examples of how counter would in diferent states </h1>

<Bar current={50} target={80}/>
<Bar current={90} target={80}/>
<Bar current={120} target={80}/>
<!-- 
<style lang="scss">
</style>
-->
