<script lang="ts">
    import { useNavigate, useLocation } from "svelte-navigator";
    import { sessionToken } from "$/lib/stores";
  
    const navigate = useNavigate();
    const location = useLocation();
  
    $: if (!$sessionToken) {
      navigate("/admin/login", {
        state: { from: $location.pathname },
        replace: true,
      });
    }
  </script>
  
  {#if $sessionToken}
    <slot />
  {/if}
  