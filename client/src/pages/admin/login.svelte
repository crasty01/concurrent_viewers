<script lang="ts">
  import { apiUrl } from "$/lib/backend.json";
  import { navigate, useLocation } from "svelte-navigator";

  import { sessionToken } from "$/lib/stores";
  const svelte_location = useLocation();

  const redirectpath =
    ($svelte_location.state && $svelte_location.state.from) || "/admin";
  const redirect = `${location.origin}${redirectpath}`;

  $: if ($sessionToken) {
      navigate("/admin", {
        replace: true,
      });
    }
</script>

{#if !$sessionToken}
<div>
  <a href={`${apiUrl}/login?${new URLSearchParams({ redirect }).toString()}`}>
    Login with twitch
  </a>
</div>
{/if}