<script lang="ts">
  import MetricRow from "$/components/metricRow.svelte";
  import { fetchChannelmertics, keyedWeekBucket } from "$/lib/adminFetch";
  import { sessionToken } from "$/lib/stores";

  export let channel: string;

  let lastID: string | undefined;
  let data: Array<keyedWeekBucket> = [];

  function updateData() {
    data = [];
    const payload: { lastID?: string; limit?: number } = { limit: 50 };

    if (lastID) {
      payload.lastID = lastID;
    }
    fetchChannelmertics($sessionToken, channel, payload).then((val) => {
      lastID = val.lastID;
      data = val.metrics;
    });
  }
  updateData();
</script>

{channel} metrics
{#if data.length > 0}
  <div>
    <table>
      <tr>
        <th>Week id</th>
        <th>Metrics Sum</th>
        <th>Metrics count</th>
        <th>Average</th>
        <th>Target</th>
      </tr>
      {#each data as week}
        <MetricRow {week} {channel} />
      {/each}
    </table>
  </div>
  {#if lastID}
    <div>
      <button on:click={updateData}>Next</button>
    </div>
  {/if}
{:else}
  <div>Loading</div>
{/if}
