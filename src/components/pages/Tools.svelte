<script lang="ts">
  import { runtime, type IStorageRT, type MarkAsDoneModel } from "src/storage";
  import { onDestroy, onMount } from "svelte";
  import MarkAsDone from "../Mark_as_done.svelte";

  let isLoading = false;
  let isReady = false;
  let isAvaMarkAsDone: MarkAsDoneModel = {
    status: false,
    done: false,
    count: 0,
  };
  let status: { isError: boolean; msg?: string } = { isError: false };
  let isStop = false;
  let storageRemoveListener: () => void;

  function setStatus(msg: string, isError = false) {
    status = { isError, msg };
  }

  function reset() {
    isLoading = false;
    isStop = false;
  }

  async function sendMarkAsDone() {
    await runtime.send({
      context: {
        actionType: "status",
        data: {
          status: {
            msg: "Send signal mark as done",
            code: "markAsDone",
          },
        },
      },
    });
  }

  async function sendCheckIsAvaMarkAsDone() {
    await runtime.send({
      context: {
        actionType: "status",
        data: {
          status: {
            msg: "Send signal mark as done",
            code: "isAvaMarkAsDone",
          },
        },
      },
    });
  }

  function parseData(dataLocal: IStorageRT) {
    console.log(dataLocal);
    console.log("ready", isReady);
    setStatus("...");
    if (dataLocal.context.actionType === "status") {
      const msg = dataLocal.context.data.status.msg;
      setStatus(msg);
      switch (dataLocal.context.data.status.code) {
        case "loading":
          isLoading = true;
          return;
        case "stop":
          reset();
          return;
        case "ready":
          isLoading = false;
          isReady = true;
          sendCheckIsAvaMarkAsDone();
          return;
        case "error":
          setStatus(msg, true);
          isLoading = false;
          isReady = true;
          return;
        default:
          console.log(dataLocal);
          setStatus("Error unsupported status code", true);
          return;
      }
    } else if (dataLocal.context.actionType === "option") {
      switch (dataLocal.context.data.status.code) {
        case "isAvaMarkAsDone":
          isAvaMarkAsDone = dataLocal.context.data.markAsDone;
          break;
      }
      isLoading = false;
      console.log(dataLocal);
    }
  }

  async function readySignalSend() {
    // Ready signal
    await runtime.send({
      context: {
        actionType: "content",
        data: {
          status: {
            msg: "Is content script ready",
            code: "ready",
          },
        },
      },
    });
  }

  onMount(async () => {
    runtime.fromOption = true;
    runtime.selfParseData = parseData;

    storageRemoveListener = runtime.addListener(parseData);

    await readySignalSend();
  });

  onDestroy(() => {
    storageRemoveListener();
  });
</script>

<div class="py-4">
  <MarkAsDone
    bind:isLoading
    bind:isAvaMarkAsDone
    onClick={sendMarkAsDone}
    bind:isReady
  />
</div>
