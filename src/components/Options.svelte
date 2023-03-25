<script lang="ts">
  import "src/options/styles.css";
  import type { IStorage } from "src/storage";
  import type { TabName } from "src/utils/types";
  import AutoLogin from "./pages/Auto_login.svelte";
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";
  import { fade, crossfade, blur } from "svelte/transition";
  import About from "./pages/About.svelte";
  export let data: IStorage;
  let tabName: TabName = "auto blc";
</script>

<div
  class="w-72 h-96 pt-4 px-3 items-center overflow-hidden justify-between flex flex-col gap-2 tracking-wider"
>
  <div class="w-full">
    <Header />
    <div class="tabs w-full">
      <button
        on:click={() => (tabName = "auto blc")}
        class="tab tab-lifted {tabName === 'auto blc' && 'tab-active'}"
        >Auto login</button
      >
      <!-- <button
        on:click={() => (tabName = "tools")}
        class="tab tab-lifted {tabName === 'tools' && 'tab-active'}"
        >Tools</button
      > -->
      <button
        on:click={() => (tabName = "about")}
        class="tab tab-lifted {tabName === 'about' && 'tab-active'}"
        >About</button
      >
    </div>
    {#if tabName === "auto blc"}
      <div><AutoLogin {data} /></div>
    {/if}
    <!-- {#if tabName === "tools"}
      <div>Tools</div>
    {/if} -->
    {#if tabName === "about"}
      <div><About /></div>
    {/if}
  </div>
  <Footer />
</div>
