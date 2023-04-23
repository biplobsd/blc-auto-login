<script lang="ts">
  import { runtime, type IStorageRT, type MarkAsDoneModel } from "src/storage";
  import { onDestroy, onMount } from "svelte";
  import MarkAsDone from "../Mark_as_done.svelte";
  import { isRightSite } from "src/utils/helper";
  import log from "src/utils/logger";

  let isLoading = false;
  let isReady = false;
  let isDisable = false;
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
    try {
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
    } catch (e) {
      log.error(e);
    }
  }

  async function sendCheckIsAvaMarkAsDone() {
    try {
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
    } catch (e) {
      log.error(e);
    }
  }

  function parseData(dataLocal: IStorageRT) {
    log.info(dataLocal);
    log.info("ready", isReady);
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
          log.info(dataLocal);
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
      log.info(dataLocal);
    }
  }

  async function readySignalSend() {
    // Ready signal
    try {
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
    } catch (e) {
      log.error(e);
    }
  }

  async function initialConnection() {
    runtime.fromOption = true;
    runtime.selfParseData = parseData;

    storageRemoveListener = runtime.addListener(parseData);

    await readySignalSend();
  }

  onMount(async () => {
    if (!(await isRightSite())) {
      log.info("is not Right site");
      isDisable = true;
      return;
    }
    await initialConnection();
  });

  onDestroy(() => {
    if (!isDisable) {
      storageRemoveListener();
    }
  });
</script>

<div class="py-4">
  <MarkAsDone
    bind:isLoading
    bind:isAvaMarkAsDone
    onClick={sendMarkAsDone}
    bind:isReady
    bind:isDisable
  />
</div>
