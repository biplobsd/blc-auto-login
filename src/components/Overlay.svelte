<script lang="ts">
  import {
    runtime,
    storage,
    type IStorage,
    type IStorageRT,
    type MarkAsDoneModel,
  } from "src/storage";
  import {
    delay,
    getXpathFromElement,
    getXpathFromElements,
    isRightSite,
  } from "src/utils/helper";
  import log from "src/utils/logger";
  import {
    FORM_LOGIN_BUTTON,
    INPUT_PASSWORD_FIELD,
    INPUT_USERNAME_FIELD,
    LOADING_MARK_AS_DONE_BUTTON,
    LOADING_UNMARK_AS_DONE_BUTTON,
    LOGIN_BUTTON,
    MARK_AS_DONE_BUTTON,
    UNMARK_AS_DONE_BUTTON,
    USERNAME,
  } from "src/utils/xpaths";
  import { onDestroy, onMount } from "svelte";

  let data: IStorage;
  let isLoading = false;
  let isStop = false;
  let storageRemoveListener: () => void;

  async function checkingIsDoAttemp() {
    log.info("data", data);
    if (
      !data.context.isAutoLoginOn ||
      (data.context.isAutoLoginOn &&
        (!data.context.userName || !data.context.password))
    ) {
      return false;
    }

    if (!(await isRightSite(false))) {
      log.info("is not Right site");
      return false;
    }

    if (checkIsLogin()) {
      log.info("Already logged");
      return false;
    }

    return true;
  }

  async function submitButtonClick() {
    let formloginEle: HTMLElement = undefined;
    for (let index = 0; index < 3; index++) {
      formloginEle = getXpathFromElement(FORM_LOGIN_BUTTON);
      if (formloginEle) {
        break;
      }
      await delay(100);
    }

    if (!formloginEle) {
      return false;
    }

    formloginEle.click();
    return true;
  }

  async function autoLogin() {
    const loginEle = getXpathFromElement(LOGIN_BUTTON);
    if (!loginEle) {
      return false;
    }
    loginEle.click();

    await delay(50);

    const userNameField = getXpathFromElement(INPUT_USERNAME_FIELD);
    if (!userNameField) {
      return false;
    }

    (userNameField as HTMLInputElement).value = data.context.userName;

    const passwordField = getXpathFromElement(INPUT_PASSWORD_FIELD);
    if (!passwordField) {
      return false;
    }
    (passwordField as HTMLInputElement).value = data.context.password;

    if (!(await submitButtonClick())) {
      return false;
    }

    return true;
  }

  function checkIsLogin() {
    return getXpathFromElement(USERNAME);
  }

  async function tryAutoLogin() {
    data = await storage.get();
    await delay(10);
    log.info("Checking.. blc-auto-login");
    if (await checkingIsDoAttemp()) {
      log.info("Attemp login..");
      if (autoLogin()) {
        log.info("Done");
      }
    }
  }

  async function checkIsAvaMarkAsDone() {
    if (isLoading) {
      return;
    }
    isLoading = true;
    try {
      const markAsDoneButtons = getXpathFromElements(MARK_AS_DONE_BUTTON);
      if (markAsDoneButtons) {
        await sendDataMarkAsDone({
          count: markAsDoneButtons.length,
          done: true,
          status: true,
        });
        return;
      }

      const unMarkAsDoneButtons = getXpathFromElements(UNMARK_AS_DONE_BUTTON);
      if (unMarkAsDoneButtons) {
        await sendDataMarkAsDone({
          count: unMarkAsDoneButtons.length,
          done: false,
          status: true,
        });
        return;
      }

      await sendDataMarkAsDone();
    } finally {
      isLoading = false;
    }
  }

  async function markAsDone() {
    if (isLoading) {
      return;
    }
    isLoading = true;

    await loadingSignalSend();

    try {
      let markAsDoneButtons = getXpathFromElements(MARK_AS_DONE_BUTTON);
      if (markAsDoneButtons) {
        for (let x of markAsDoneButtons) {
          x.click();
        }
        await delay(50);

        for (let index = 0; index < 60; index++) {
          if (!getXpathFromElement(LOADING_MARK_AS_DONE_BUTTON)) {
            break;
          }
          await delay(100);
        }

        const unMarkAsDoneButtons = getXpathFromElements(UNMARK_AS_DONE_BUTTON);
        await sendDataMarkAsDone({
          count: unMarkAsDoneButtons.length,
          done: false,
          status: true,
        });
        return;
      }

      let unMarkAsDoneButtons = getXpathFromElements(UNMARK_AS_DONE_BUTTON);
      if (unMarkAsDoneButtons) {
        for (let x of unMarkAsDoneButtons) {
          x.click();
        }
        await delay(50);

        for (let index = 0; index < 60; index++) {
          if (!getXpathFromElement(LOADING_UNMARK_AS_DONE_BUTTON)) {
            break;
          }
          await delay(100);
        }

        const markAsDoneButtons = getXpathFromElements(MARK_AS_DONE_BUTTON);
        await sendDataMarkAsDone({
          count: markAsDoneButtons.length,
          done: true,
          status: true,
        });
        return;
      }

      await sendDataMarkAsDone();
    } finally {
      isLoading = false;
    }
  }

  async function sendDataMarkAsDone(
    markAsDone: MarkAsDoneModel = {
      count: 0,
      done: true,
      status: false,
    }
  ) {
    try {
      await runtime.send({
        context: {
          actionType: "option",
          data: {
            status: {
              msg: "Mark as button info",
              code: "isAvaMarkAsDone",
            },
            markAsDone,
          },
        },
      });
    } catch (e) {
      log.error(e);
    }
  }

  function parseData(dataLocal: IStorageRT) {
    if (dataLocal.context.actionType === "status") {
      switch (dataLocal.context.data.status.code) {
        case "loading":
          isLoading = true;
          break;
        case "stop":
          isLoading = false;
          isStop = false;
          break;
        case "error":
          isLoading = false;
          isStop = false;
          break;
        case "isAvaMarkAsDone":
          checkIsAvaMarkAsDone();
          break;
        case "markAsDone":
          markAsDone();
          break;
        default:
          break;
      }
    } else if (dataLocal.context.actionType === "content") {
      if (dataLocal.context.data.status) {
        switch (dataLocal.context.data.status.code) {
          case "stop":
            isStop = true;
            break;
          case "ready":
            if (isLoading) {
              loadingSignalSend();
            } else {
              readySignalSend();
            }
            break;
          default:
            break;
        }
      } else {
        log.info("data", "Unsupported type");
      }
    } else {
      log.info("Unsupported type");
    }
  }

  async function readySignalSend() {
    // Ready signal
    try {
      await runtime.send({
        context: {
          actionType: "status",
          data: {
            status: {
              msg: "Ready for accept request",
              code: "ready",
            },
          },
        },
      });
    } catch (e) {
      log.error(e);
    }
  }

  async function loadingSignalSend() {
    try {
      await runtime.send({
        context: {
          actionType: "status",
          data: {
            status: {
              msg: "Working start",
              code: "loading",
            },
          },
        },
      });
    } catch (e) {
      log.error(e);
    }
  }

  onMount(() => {
    runtime.selfParseData = parseData;
    storageRemoveListener = runtime.addListener(parseData);

    readySignalSend();
    tryAutoLogin();
  });

  onDestroy(() => {
    try {
      runtime.send({ context: { actionType: "none" } });
    } catch (e) {
      log.error(e);
    }
    storageRemoveListener();
  });
</script>
