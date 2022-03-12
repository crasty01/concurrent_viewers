<script lang="ts">
  import Bar from "$/components/bar.svelte";
  function hslToHex(h, s, l) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0"); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  let target=10;
  let count=6;

  const colors = {
    colorProgress: {
      desciption: "Progress color",
      value: hslToHex(305, 94, 30),
    },
    colorOverdrive: {
      desciption: "Progress overflow color",
      value: hslToHex(120, 34, 62),
    },
    colorText: {
      desciption: "Text color",
      value: hslToHex(199, 0, 100),
    },
    colorTextStroke: {
      desciption: "Text stroke color",
      value: hslToHex(261, 68, 31),
    },
    colorBg: {
      desciption: "Background color",
      value: hslToHex(271, 84, 20),
    },
  };

  $: vars = `
--progress-color: ${colors.colorProgress.value};
--overdrive-color: ${colors.colorOverdrive.value};
--text-color: ${colors.colorText.value};
--text-stroke: ${colors.colorTextStroke.value};
--bg-color: ${colors.colorBg.value};
`;

  $: obsCss = `
body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }
.obs-overrideable {
${vars}
}
`;
</script>

<div style={vars}>
  <Bar current={count} target={target} />
</div>
<div>
    <label for="config-target">Target: </label>
    <input id="config-target" type="number" bind:value={target} />
    <label for="config-count">Current count: </label>
    <input id="config-target" type="number" bind:value={count} />
</div>
{#each Object.entries(colors) as [key, color]}
  <div>
    <label for="config-{key}">{color.desciption}: </label>
    <input id="config-{key}" type="color" bind:value={color.value} />
  </div>
{/each}
<div>
  <textarea disabled class="output">{obsCss}</textarea>
</div>

<style lang="scss">
  .output {
    width: 60vh;
    height: 20vh;
  }
</style>
