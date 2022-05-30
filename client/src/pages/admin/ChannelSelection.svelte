<script lang="ts">
  import { fetchAvailableChannels } from "$/lib/adminFetch";

  import { sessionToken } from "$/lib/stores";
import { Link } from "svelte-navigator";

  let channels: string[]=[];

  fetchAvailableChannels($sessionToken).then((val) => {
    channels = val;
  }); 
</script>

{#if channels.length>0}

<div>
    Channels awailable to you. Please imagine a dropdown list for it
</div>
{#each channels as channel}
    <div>
        <Link to="/admin/channel/{channel}">{channel}</Link>
    </div>
{/each}

{:else}
<div>
  Loading
  </div>
{/if}
