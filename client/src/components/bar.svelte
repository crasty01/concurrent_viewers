<script lang="ts">
  import { afterUpdate, onMount } from "svelte";

  const animateDur = "0.3s";

  let barWidth = 800;
  let barHeight = 300;
  export let current = 11;
  export let target = 24;
  function setCounter(current: number, target: number) {
    const maxRequired = Math.max(target / 0.8, current);
    return {
      maxRequired,
      percentage: current / maxRequired,
      Targetpercentage: target / maxRequired,
    };
  }
  let svgObj: SVGSVGElement;
  let animateObj: SVGAnimateElement;
  let targetCount = {
    maxRequired: 0,
    percentage: 0,
    Targetpercentage: 0,
  };
  let currentCount = {
    maxRequired: 0,
    percentage: 0,
    Targetpercentage: 0,
  };
  let mounted = false;
  const animationEnd = () => {
    currentCount = targetCount;
  };
  onMount(() => {
    currentCount = setCounter(current, target);
    animateObj.addEventListener("endEvent", animationEnd);
    mounted = true;
  });

  $: if (current && target && mounted) {
    targetCount = setCounter(current, target);
    svgObj.querySelectorAll("animate").forEach((x) => x.beginElement());
  }
</script>

<div class="loading_bar">
  <!--<div class="progress" style="width: {percentage}%"> -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 {barWidth} {barHeight}"
    preserveAspectRatio="xMidYMid slice"
    bind:this={svgObj}
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
    </defs>
    <mask id="mymask">
      <rect width="100%" height="100%" fill="url(#pppixelate-pattern)" />
    </mask>
    <rect width="100%" height="100%" fill="white" />
    <svg
      x="0"
      width={barWidth * currentCount.percentage}
      height="100%"
      viewBox="0 0 {barWidth * currentCount.percentage} {barHeight}"
    >
      <animate
        bind:this={animateObj}
        attributeName="width"
        values="{barWidth * currentCount.percentage};{barWidth *
          targetCount.percentage}"
        dur={animateDur}
        fill="freeze"
      />
      <animate
        attributeName="viewBox"
        values="0 0 {barWidth *
          currentCount.percentage} {barHeight};0 0 {barWidth *
          targetCount.percentage} {barHeight}"
        dur={animateDur}
        fill="freeze"
      />
      <rect class="progress bg" width={barWidth} height="100%" />
      <rect
        class="progress fg"
        width={barWidth}
        height="100%"
        mask="url(#mymask)"
      />
      <svg
        width={barWidth * currentCount.Targetpercentage}
        height="100%"
        viewBox="0 0 {barWidth * currentCount.Targetpercentage} {barHeight}"
      >
        <animate
          attributeName="width"
          values="{barWidth * currentCount.Targetpercentage};{barWidth *
            targetCount.Targetpercentage}"
          dur={animateDur}
          fill="freeze"
        />
        <animate
          attributeName="viewBox"
          values="0 0 {barWidth *
            currentCount.Targetpercentage} {barHeight};0 0 {barWidth *
            targetCount.Targetpercentage} {barHeight}"
          dur={animateDur}
          fill="freeze"
        />
        <rect class="progress-in-progress bg" width="100%" height="100%" />
        <rect
          class="progress-in-progress fg"
          width="100%"
          height="100%"
          mask="url(#mymask)"
        />
      </svg>
    </svg>
    <rect
      x={barWidth * currentCount.Targetpercentage}
      width="3"
      height="100%"
      stroke="black"
    >
      <animate
        attributeName="x"
        values="{barWidth * currentCount.Targetpercentage};{barWidth *
          targetCount.Targetpercentage}"
        dur={animateDur}
        fill="freeze"
      />
    </rect>
  </svg>
  <div class="title">Weekly CCV Goal</div>
  <div class="count">{Math.floor(current)}/{Math.floor(target)}</div>
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
    & .title {
      position: absolute;
      top: 4px;
      bottom: 4px;
      left: 4px;
      font-size: 200%;
    }
    & .count {
      position: absolute;
      float: right;
      top: 4px;
      bottom: 4px;
      right: 4px;
      font-size: 200%;
    }
    & .target {
      position: absolute;
      top: 0;
      padding: 0;
      border-right: 2px solid black;
      left: 0;
      width: 10%;
    }

    @mixin progressFiller($color) {
      &.fg {
        fill: lighten($color: $color, $amount: 20%);
      }
      &.bg {
        fill: $color;
      }
    }
    & .progress {
      @include progressFiller(hsl(120, 100%, 40%));
    }
    & .progress-in-progress {
      @include progressFiller(hsl(20, 100%, 40%));
    }
  }
</style>
