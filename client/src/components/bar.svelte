<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { fetchData, Data } from "$/lib/fetch";
  const TIMER = 30 * 60 * 1000; // 3 * 1000;

  let timer = null;
  let data: Data = null;
  $: percentage =
    (data?.current?.average / (data?.last?.average * 2)) * 90 + 10;

  onMount(async () => {
    data = await fetchData("cdubya719");
    timer = setInterval(async () => {
      data = await fetchData("cdubya719");
    }, TIMER);
  });

  onDestroy(() => {
    clearInterval(timer);
  });
</script>

<div class="loading_bar">
  <div class="progress" style="width: {percentage | 0}%" />
</div>

<style lang="scss">
  .loading_bar {
    width: 720px;
    height: 40px;
    position: relative;
    border: 2px solid black;
    border-radius: 1rem;
    overflow: hidden;

    & .progress {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 10%;
      // border-top-right-radius: calc(1rem - 2px);
      // border-bottom-right-radius: calc(1rem - 2px);
      background-color: black;
    }
  }
</style>
