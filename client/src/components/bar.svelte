<script lang="ts">
  import { onMount } from "svelte";

  let clazz = ""; 
  export { clazz as class };
  export let current = 11;
  export let target = 24;
  function setCounter(current: number, target: number) {
    const maxRequired = Math.max(target / 0.8, current);
    return {
      percentage: current / maxRequired,
      Targetpercentage: target / maxRequired,
    };
  }
  let targetCount = {
    percentage: 0,
    Targetpercentage: 0,
  };
  let mounted = false;
  onMount(() => {
    mounted = true;
  });

  $: if (current && target && mounted) {
    targetCount = setCounter(current, target);
  }
</script>

<div
  class="{`loading_bar ${clazz || ''}`}"
  style="--target-pos: {targetCount.Targetpercentage * 100}%; 
         --target-percentage: {targetCount.Targetpercentage};
         --current-pos: {targetCount.percentage * 100}%"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 100% 100%"
    preserveAspectRatio="xMidYMid slice"
    class="bar-svg"
  >
    <defs>
      <pattern
        id="pppixelate-pattern"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
        patternTransform="scale(1.5) rotate(0)"
        shape-rendering="crispEdges"
      >
        <path
          d="M 0 0.5 h10
            M-1 1.5 h10m10 0h10
            M-2 2.5 h10m10 0h10
            M-3 3.5 h10m10 0h10
            M-4 4.5 h10m10 0h10
            M-5 5.5 h10m10 0h10
            M-6 6.5 h10m10 0h10
            M-7 7.5 h10m10 0h10
            M-8 8.5 h10m10 0h10
            M-9 9.5 h10m10 0h10
            M10 10.5 h10
            M9 11.5 h10
            M8 12.5 h10
            M7 13.5 h10
            M6 14.5 h10
            M5 15.5 h10
            M4 16.5 h10
            M3 17.5 h10
            M2 18.5 h10
            M1 19.5 h10
                 "
          stroke="white"
        />
      </pattern>
      <mask id="mymask">
        <rect width="100%" height="100%" fill="url(#pppixelate-pattern)" />
      </mask>
    </defs>
    <rect class="progress" x="0" width="100%" height="100%" />
    <rect class="progress-in-progress" width="100%" height="100%" />
    <rect class="hatch-mask" width="100%" height="100%" mask="url(#mymask)" />
    <rect class="bg-mask" width="100%" height="100%" />
    <rect class="target-point" x="0" width="3" height="100%" />
    <text class="text" x="1%" y="80%">Weekly CCV Goal </text>
    <text class="text count" x="99%" y="80%"
      >{Math.floor(current)}/{Math.floor(target)}</text
    >
  </svg>
</div>

<style lang="scss">
  .loading_bar {
    // --progress-color: hsl(305, 94%, 30%);
    // --overdrive-color: hsl(120, 100%, 40%);
    // --text-color: hsl(199, 0%, 100%);
    // --text-stroke: hsl(261, 68%, 31%);
    // --bg-color: hsl(271, 84%, 20%);

    width: 720px;
    height: 40px;
    position: relative;
    border: 2px solid black;
    border-radius: 1rem;
    overflow: hidden;
    margin: 30px;
    & .count {
      position: absolute;
      float: right;
      top: 4px;
      bottom: 4px;
      right: 4px;
      font-size: 200%;
    }
    & .bar-svg {
      transition: all 0.3s;
      & .progress {
        fill: var(--overdrive-color, hsl(120, 100%, 40%));
      }
      & .progress-in-progress {
        transform: scale(var(--target-percentage), 1);
        transition: inherit;
        fill: var(--progress-color, hsl(305, 94%, 30%));
      }
      & .hatch-mask {
        fill: rgba(0, 0, 0, 0.2);
      }
      & .bg-mask {
        fill: var(--bg-color,hsl(271, 84%, 20%));

        transition: inherit;
        transform: translateX(var(--current-pos));
      }

      & .target-point {
        fill: "black";

        transition: inherit;
        transform: translateX(var(--target-pos));
      }
      & .text {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        font-size: xx-large;
        font-weight: 500;
        fill: var(--text-color,hsl(199, 0%, 100%));
        stroke: var(--text-stroke,hsl(261, 68%, 31%));
        stroke-width: 1.5px;
        &.count {
          text-anchor: end;
        }
      }
    }
  }
</style>
