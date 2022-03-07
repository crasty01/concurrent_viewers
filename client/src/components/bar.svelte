<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fetchData, Data } from "$/lib/fetch";
  const TIMER = 30 * 60 * 1000; // 3 * 1000;

  const skipMount=false;
  // $: data = {current:{average:0,count:0,sum:0},last:{average:0,count:0,sum:0}};

  export let current = 11
  export let target = 24
  $: maxRequired = Math.max(target / 0.8, current)
  $: percentage = current / maxRequired *100
  $: Targetpercentage = target / maxRequired * 100
</script>

<div class="loading_bar">
<!--<div class="progress" style="width: {percentage}%"> -->
    <svg  xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%"  xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice">
    <defs>
        <pattern id="pppixelate-pattern" width="20" height="20" patternUnits="userSpaceOnUse"
            patternTransform="scale(1.5) rotate(0)" shape-rendering="crispEdges">
            <path d="M 0 0.5 h10
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
                 " stroke="white" />
        </pattern>
    </defs>
    <mask id="mymask">
      <rect width="100%" height="100%" fill="url(#pppixelate-pattern)"/>
    </mask>
    
    <rect class="progress bg" width="{percentage}%" height="100%"></rect>
    <rect class="progress fg" width="{percentage}%" height="100%" mask="url(#mymask)"></rect>
    <rect class="progress-in-progress bg" width="{Math.min(percentage,Targetpercentage)}%" height="100%"></rect>
    <rect class="progress-in-progress fg" width="{Math.min(percentage,Targetpercentage)}%" height="100%" mask="url(#mymask)"></rect>
    <path d="M{Targetpercentage/100*800} 0v100%" stroke-width="3" stroke="black">
    <!-- <rect height="100%" fill="url(#pppixelate-pattern)"></rect> -->
</svg>
  <div class= "title">Weekly CCV Goal</div>
  <div class= "count">{Math.floor(current)}/{Math.floor(target)}</div>
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
      font-size: 200%;
    }
    & .count{
      position: absolute;
      float: right;
      top: 4px;
      bottom: 4px;
      right: 4px;
      font-size: 200%;

    }
    & .target{
      position: absolute;
      top: 0;
      padding: 0;
      border-right: 2px solid black;
      left: 0;
      width: 10%;
    }    
    & .progress-in-progress {
      $mainColor:hsl(20, 100%, 20%);
      &.fg{
        fill: lighten($color: $mainColor, $amount: 20%);
      }
      &.bg{
        fill: $mainColor;
      }
    }

    @mixin progressFiller($color){
      &.fg{
        fill: lighten($color: $color, $amount: 20%);
      }
      &.bg{
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
