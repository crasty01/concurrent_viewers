<script lang="ts">
  import { Router, Route, Link } from "svelte-navigator";

  import LivePage from "./pages/livePage.svelte";
  import DemoPage from "./pages/demoPage.svelte";
  import ObsConfig from "./pages/obsConfig.svelte";
  import Login from "./pages/admin/login.svelte";
  import PrivateRoute from "./components/PrivateRoute.svelte";
  import ChannelSelection from "./pages/admin/ChannelSelection.svelte";
  import ChannelData from "./pages/admin/ChannelData.svelte";

  import { sessionToken } from "$/lib/stores";
  import { logout } from "./lib/adminFetch";

  async function disconnect() {
    await logout($sessionToken);
  }
</script>

<Router>
  <Route path="/demo">
    <DemoPage />
  </Route>
  <Route path="/live/:channel" let:params>
    <LivePage account={params.channel} />
  </Route>
  <Route path="/obs-config">
    <ObsConfig />
  </Route>
  <Route path="/admin/*">
    {#if $sessionToken}
      <div>
        <button on:click={disconnect}>logout</button>
      </div>
    {/if}
    <div>
      <PrivateRoute path="/">
        <ChannelSelection />
      </PrivateRoute>
      <Route path="login">
        <Login />
      </Route>
      <PrivateRoute path="/channel/:channel" let:params>
        <ChannelData channel={params.channel} />
      </PrivateRoute>
    </div>
  </Route>
</Router>
