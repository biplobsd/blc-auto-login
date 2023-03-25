<script lang="ts">
  import "src/options/styles.css";
  import { DEFAULT_STORAGE, storage, type IStorage } from "src/storage";
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";
  import { Icon, InformationCircle, ArrowPath } from "svelte-hero-icons";

  export let data: IStorage;
  let loading = false;
  let msg = "";

  async function changeMode(
    e: MouseEvent & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    msg = "";
    data.context.isAutoLoginOn = e.currentTarget.checked;
    loading = true;
    try {
      await storage.set(data);
    } finally {
      loading = false;
    }
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
    try {
      loading = true;
      await storage.set(data);
      msg = "Saved account credensial";
    } finally {
      loading = false;
    }
  }

  async function clearAcccount() {
    try {
      loading = true;
      await storage.set(DEFAULT_STORAGE);
      data = DEFAULT_STORAGE;
      msg = "Cleared account credensial";
    } finally {
      loading = false;
    }
  }
</script>

<div
  class="w-72 pt-4 px-3 items-center flex flex-col justify-center gap-2 tracking-wider"
>
  <Header />
  <div class="divider my-0" />
  <div
    class="flex flex-col items-center gap-1 w-full transition-all duration-500"
  >
    <div class="flex items-center gap-2 justify-between w-full">
      <div class="text-xl">
        Auto login <span
          class={data.context.isAutoLoginOn &&
            (!data.context.userName || !data.context.password
              ? "text-yellow-500"
              : "text-green-500")}
          >turn {data.context.isAutoLoginOn
            ? !data.context.userName || !data.context.password
              ? "blank"
              : "on"
            : "off"}</span
        >
      </div>
      <input
        indeterminate={!data.context.userName || !data.context.password}
        disabled={loading}
        type="checkbox"
        class="toggle {data.context.isAutoLoginOn &&
          (!data.context.userName || !data.context.password
            ? 'toggle-warning'
            : 'toggle-success')} "
        on:click={changeMode}
        bind:checked={data.context.isAutoLoginOn}
      />
    </div>
    <div class="divider my-0" />
    <div class="font-bold h-3">{msg}</div>
    <form
      on:change={saveAccount}
      class="{!data.context.isAutoLoginOn &&
        'opacity-40'} mt-2 flex flex-col gap-2 w-full transition-all duration-500"
    >
      <div class="flex justify-between items-center">
        <div class="font-bold flex gap-1 items-center">
          BLC Account credensial <span
            class="tooltip"
            data-tip="Need for login purpose"
            ><Icon src={InformationCircle} size="16" /></span
          >
        </div>
        <button
          on:click={clearAcccount}
          disabled={loading || !data.context.isAutoLoginOn}
          class="text-red-300 tooltip tooltip-left"
          data-tip="Clear account credensial"
        >
          <Icon src={ArrowPath} size="16" />
        </button>
      </div>
      <input
        on:click={() => (msg = "")}
        disabled={loading || !data.context.isAutoLoginOn}
        bind:value={data.context.userName}
        required
        type="text"
        placeholder="Username"
        class="input w-full max-w-xs input-bordered input-info"
      />
      <input
        on:click={() => (msg = "")}
        disabled={loading || !data.context.isAutoLoginOn}
        bind:value={data.context.password}
        required
        type="password"
        placeholder="Password"
        class="input w-full max-w-xs input-bordered input-info"
      />
    </form>
  </div>
  <Footer />
</div>
