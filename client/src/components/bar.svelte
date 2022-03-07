<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { fetchData, Data } from "$/lib/fetch";
  const TIMER = 30 * 60 * 1000; // 3 * 1000;

  const skipMount=true;

  let timer = null;
  // $: data = {current:{average:0,count:0,sum:0},last:{average:0,count:0,sum:0}};

  export let currentCount = 11
  export let previousCount = 24
  $: maxRequired = Math.max(previousCount / 0.8, currentCount)
  $: percentage = currentCount / maxRequired *100
  $: Targetpercentage = previousCount / maxRequired * 100

  const update_bar = async (current :number ,last :number) =>{
    previousCount = last
    currentCount = current
  } 
   

  // $: Targetpercentage = 80
  onMount(async () => {
    if (skipMount){
      return
    }
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

<div class="loading_bar">
  
  <div class="progress" style="width: {percentage}%" />
  <div class="target" style="width: {Targetpercentage}%" />
  <div class="progress-in-progress" style="width: {Math.min(percentage,Targetpercentage)}%" />
  
  <div class= "title">Weekly CCV Goal</div>
  <div class= "count">{currentCount}/{previousCount}</div>
</div>

<style lang="scss">
  .loading_bar {
    width: 720px;
    height: 40px;
    position: relative;
    border: 2px solid black;
    border-radius: 1rem;
    overflow: hidden;
    margin: 30px;
    & .title{
      position: absolute;
      top: 4px;
      bottom: 4px;
      left: 4px;
      font-size: 3vh;
      font-family: Arial, Helvetica, sans-serif;
    }
    & .count{
      position: absolute;
      float: right;
      top: 4px;
      bottom: 4px;
      right: 4px;
      font-size: 3vh;

    }
    & .target{
      position: absolute;
      top: 0;
      
      border-right: 2px solid black;
      bottom: 0;
      left: 0;
      width: 10%;
    }    
    & .progress-in-progress {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 10%;
      // border-top-right-radius: calc(1rem - 2px);
      // border-bottom-right-radius: calc(1rem - 2px);
      background-color: red;
    }
    & .progress {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 10%;
      // border-top-right-radius: calc(1rem - 2px);
      // border-bottom-right-radius: calc(1rem - 2px);
      background-color: green;
    }
  }
</style>
