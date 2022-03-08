<script lang="ts">
  
  import { onDestroy, onMount } from "svelte";
  import Bar from "$/components/bar.svelte";
  import { fetchData } from "./lib/fetch";
  
  const TIMER = 60 * 1000; // 3 * 1000;
  let timer = null
  let animateTimer = null
  $: previousCount = 0
  $: currentCount = 0
  $: animateCount = 50
  let animatetarget = 80
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
    animateTimer = setInterval(() =>{
      animateCount = (animateCount+ 30) % 120
    },1000*5)
  });

  onDestroy(() => {
    clearInterval(timer);
    clearInterval(animateTimer);
  });

</script>
<h1> Live count </h1>
<Bar current={currentCount} target={previousCount}/>
<h1> Static examples of how counter would in diferent states </h1>

<Bar current={50} target={80}/>
<Bar current={90} target={80}/>
<Bar current={120} target={80}/>

<Bar current={animateCount} target={animatetarget}/>
