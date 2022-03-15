<script lang="ts">
  import Bar from "$/components/bar.svelte";

  import { fetchCurrentDateMetric } from "$/lib/fetch";

  import { onDestroy, onMount } from "svelte";

  const TIMER = 60 * 1000; // 3 * 1000;
  let timer = null;
  let animateTimer = null;
  let target = 0;
  let current = 0;
  let roundCount = 0;
  let roundTarget = 0;
  let animateCount = 50;
  let animatetarget = 80;

  const update_bar = async (count: number, last: number) => {
    target = last;
    current = count;
  };
  // $: Targetpercentage = 80
  onMount(async () => {
    const data = await fetchCurrentDateMetric("cdubya719");
    await update_bar(data.average, data.target);
    roundTarget=target
    roundCount=Math.round(current)+.5
    timer = setInterval(async () => {
      const data = await fetchCurrentDateMetric("cdubya719");
      await update_bar(data.average, data.target);
    }, TIMER);
    animateTimer = setInterval(() => {
      animateCount = (animateCount + 30) % 120;
    }, 1000 * 5);
  });

  onDestroy(() => {
    clearInterval(timer);
    clearInterval(animateTimer);
  });
</script>

<h1>Live count</h1>
<Bar current={current} target={target} />

<h1>Rounding</h1>
<div>
  <label for="config-target" >Target: </label>
  <input id="config-target" step="0.25" type="number" bind:value={roundCount} />
  <label for="config-count">Current count: </label>
  <input id="config-target" type="number" bind:value={roundTarget} />
</div>

<h3>with exact values:</h3>
<Bar current={roundCount} target={roundTarget} />
<h3>rounded</h3>

<Bar current={Math.round(roundCount)} target={Math.round(roundTarget)} />
<h3> rounded up </h3>
<Bar current={Math.ceil(roundCount)} target={Math.ceil(roundTarget)} />
<h3> rounded down </h3>
<Bar current={Math.floor(roundCount)} target={Math.floor(roundTarget)} />
<h1>Static examples of how counter would in diferent states</h1>

<Bar current={50} target={80} />
<Bar current={90} target={80} />
<Bar current={120} target={80} />

<Bar current={animateCount} target={animatetarget} />
<div class="customized">
  <Bar current={120} target={80} />
</div>
<style lang="scss">
  .customized {
    --progress-color: hsl(305, 22%, 69%);
    --overdrive-color: hsl(120, 31%, 62%);
    --text-color: hsl(199, 0%, 100%);
    --text-stroke: hsl(261, 68%, 31%);
    --bg-color: hsl(271, 84%, 20%);
  }
</style>