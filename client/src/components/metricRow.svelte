<script lang="ts">
  import { keyedWeekBucket, updateTarget } from "$/lib/adminFetch";
  import { sessionToken } from "$/lib/stores";
import dayjs from "dayjs";

  export let week: keyedWeekBucket;

  export let channel: string;
  let clicked = false;
  let targetInput: number = week.target;
  function setClicked() {
    clicked = true;
  }

  async function submit() {
    await updateTarget($sessionToken, channel, week.key, targetInput);
    alert("target updated. Imagine it being a nice snack bar");
    week.target = targetInput;
    clicked = false;
  }

  const weekday=dayjs().year(Math.floor(parseInt(week.key)/100)).isoWeek(parseInt(week.key)%100).isoWeekday(1)
   
</script>

<tr>
  <td><div class="tooltip">{week.key}<span class="tooltiptext">from {weekday.format("YYYY-MM-DD")}<br> to {weekday.isoWeekday(7).format("YYYY-MM-DD")}</span></div></td>
  <td>{week.sum}</td>
  <td>{week.count}</td>
  <td>{week.average.toFixed(2)}</td>
  <td>
    <div on:click={setClicked}>  
    <input class="targetable" disabled={!clicked} bind:value={targetInput} type="number"/>
    {#if clicked}
      <button on:click={submit}>submit</button>
    {/if}
    </div>
  </td>
</tr>

<style lang="scss">
  .targetable {
    cursor: pointer;
  }
  .tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;

    /* Position the tooltip */
    position: absolute;
    z-index: 1;
  }
  .tooltip:hover .tooltiptext{
      visibility: visible;
  }
</style>
