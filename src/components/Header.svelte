<script lang="ts">
  import { APP_NAME, VERSION } from "src/utils/constants";
  import icon48 from "src/assets/icons/icon128.png";
</script>

<div
  class="flex items-center gap-1 mb-3 tracking-wider font-extrabold text-xl justify-between w-full"
>
  <div class="flex items-center gap-2">
    <img src={icon48} alt="Logo" class="w-8 h-8 mx-auto" />
    <span class="text-sm">{APP_NAME}</span>
  </div>
  <span class="text-xs">{VERSION}</span>
</div>
