<script lang="ts">
  import "src/options/styles.css";
  import { storage, type IStorage } from "src/storage";
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";

  export let data: IStorage;

  async function changeMode(
    e: MouseEvent & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    data.context.isAutoLoginOn = e.currentTarget.checked;
    await storage.set(data);
  }

  async function saveAccount(
    e: Event & {
      readonly submitter: HTMLElement;
    } & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) {
    e.preventDefault();

    console.log("Saveing account");

    await storage.set(data);
  }
</script>

<div class="w-72 pt-4 px-2 items-center flex flex-col justify-center gap-2">
  <Header />
  <div class="flex flex-col items-center gap-1 w-full">
    <input
      type="checkbox"
      class="toggle"
      on:click={changeMode}
      bind:checked={data.context.isAutoLoginOn}
    />
    <div>Account credensial</div>
    <form on:submit={saveAccount}>
      <input
        bind:value={data.context.userName}
        required
        type="text"
        placeholder="Type here"
        class="input w-full max-w-xs"
      />
      <input
        bind:value={data.context.password}
        required
        type="password"
        placeholder="Type here"
        class="input w-full max-w-xs"
      />
      <button class="btn">Save</button>
    </form>
  </div>
  <Footer />
</div>
