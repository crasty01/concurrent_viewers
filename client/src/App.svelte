<script lang="ts">
  import { Router, Route, Link } from "svelte-navigator";

  import LivePage from "./pages/livePage.svelte";
import DemoPage from "./pages/demoPage.svelte";
import ObsConfig from "./pages/obsConfig.svelte";

</script>

<Router>
  <main>
    <Route path="/demo">
      <DemoPage/>
    </Route>
    <Route path="/live/:channel" let:params>
      <LivePage account={params.channel} />
    </Route>
    <Route path="/obs-config">
      <ObsConfig/>
    </Route>
  </main>
</Router>
