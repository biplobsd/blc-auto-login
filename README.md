# BLC auto login

![logo](/src/assets/icons/icon128.png)

Automatically log in to the BLC website without manually entering your username and password.

![Preview](https://user-images.githubusercontent.com/43641536/227714912-f2fb693d-8b4d-4f26-8013-15a9eddb2203.gif)


## Installation
<a href="https://microsoftedge.microsoft.com/addons/detail/cklmpfnelcdadbpoonlejongcfmkngjj">
  <img src="https://get.microsoft.com/images/en-us%20dark.svg" alt="Get YST on Microsoft Edge" width="224px">
</a>

Or get the built zip from the [release](https://github.com/biplobsd/blc-auto-login/releases/latest) tab. Then follow the instructions in the [Load unpacked extensions](#load-unpacked-extensions) section. The **_/dist_** folder should be considered as the unpacked zip files.

## Usages
To get started, simply click the toggle button to turn it on - <br>
![image](https://user-images.githubusercontent.com/43641536/227714368-d9806131-87d5-49ee-844a-e2502360fa35.png)
<br>then enter your BLC login credentials.<br>
![image](https://user-images.githubusercontent.com/43641536/227714335-8925fec5-82c8-4606-b9ee-16fef9d9c8a3.png)
<br>
And you're all set. From now on, whenever you visit the https://elearn.daffodilvarsity.edu.bd/ page, if you're not already logged in, this extension will automatically input your username and password in the login section and attempt to log you in. If you're already logged in, the extension won't take any action.

## Action
Here's what you need to know about the toggle button: if the button is yellow, it means that your account credentials are blank and you won't be able to use the auto-login feature. On the other hand, if the button turns green, it indicates that everything is set up correctly and you can expect the auto-login to work. If you want to disable this feature, simply toggle the button to turn it off.

## Development

```bash
# install dependencies
npm i

# build files to `/dist` directory
# HMR for extension pages and content scripts
npm run dev
```

## Build

```bash
# build files to `/dist` directory
$ npm run build
```

## Load unpacked extensions

[Getting Started Tutorial](https://developer.chrome.com/docs/extensions/mv3/getstarted/)

1. Open the Extension Management page by navigating to `chrome://extensions`.
2. Enable Developer Mode by clicking the toggle switch next to `Developer mode`.
3. Click the `LOAD UNPACKED` button and select the `/dist` directory.

![Example](https://wd.imgix.net/image/BhuKGJaIeLNPW9ehns59NfwqKxF2/vOu7iPbaapkALed96rzN.png?auto=format&w=571)
