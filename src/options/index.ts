import Options from "src/components/Options.svelte";
import { storage } from "src/storage";

const target = document.getElementById("app");

function render() {
    storage.get().then((data) => {
        new Options({
            target, props: { data }
        });
    });
}

document.addEventListener("DOMContentLoaded", render);
