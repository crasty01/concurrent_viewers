<script lang="ts">
  import Bar from "$/components/bar.svelte";
  import { fetchCurrentDateMetric } from "$/lib/fetch";

  import { onDestroy, onMount } from "svelte";
  const TIMER = 60 * 1000; // 3 * 1000;

  export let account: string;

  let currentCount: number;
  let previousCount: number;
  let timer;
  const update_bar = (current: number, last: number) => {
    previousCount = last;
    currentCount = current;
  };
  // $: Targetpercentage = 80
  onMount(async () => {
    const data = await fetchCurrentDateMetric(account);
    update_bar(Math.ceil(data.average), data.target);
    timer = setInterval(async () => {
      const data = await fetchCurrentDateMetric(account);
      update_bar(Math.ceil(data.average), data.target);
    }, TIMER);
  });

  onDestroy(() => {
    clearInterval(timer);
  });
</script>

<div class="obs-overrideable">
  <Bar current={currentCount} target={previousCount} />
</div>
