<script lang="ts">
  import { storage, type IStorage } from "src/storage";
  import { delay, getXpathFromElement, isRightSite } from "src/utils/helper";
  import {
    FORM_LOGIN_BUTTON,
    INPUT_PASSWORD_FIELD,
    INPUT_USERNAME_FIELD,
    LOGIN_BUTTON,
    USERNAME,
  } from "src/utils/xpaths";
  import { onMount } from "svelte";

  let data: IStorage;

  async function checkingIsDoAttemp() {
    console.log("data", data);
    if (
      !data.context.isAutoLoginOn ||
      (data.context.isAutoLoginOn &&
        (!data.context.userName || !data.context.password))
    ) {
      return false;
    }

    if (!isRightSite()) {
      console.log("is not Right site");
      return false;
    }

    if (checkIsLogin()) {
      console.log("Already logged");
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
    console.log("Checking.. blc-auto-login");
    if (await checkingIsDoAttemp()) {
      console.log("Attemp login..");
      if (autoLogin()) {
        console.log("Done");
      }
    }
  }

  onMount(tryAutoLogin);
</script>
