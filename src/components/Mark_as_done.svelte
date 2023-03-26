<script lang="ts">
  import type { MarkAsDoneModel } from "src/storage";

  export let isReady: boolean;
  export let isLoading: boolean;
  export let isAvaMarkAsDone: MarkAsDoneModel;
  export let onClick: () => void;
</script>

<span
  class="{(!isReady || !isAvaMarkAsDone.status || isLoading) &&
    'tooltip'} w-full"
  data-tip={isLoading
    ? "Marking..."
    : !isReady
    ? "Wating for ready signal"
    : !isAvaMarkAsDone.status && "No mark as done found"}
>
  <button
    on:click={onClick}
    disabled={!isReady || !isAvaMarkAsDone.status || isLoading}
    class="{(!isReady || isLoading) &&
      'loading'} btn h-10 w-full {isAvaMarkAsDone.done
      ? 'bg-slate-400/90 hover:bg-slate-500 '
      : 'bg-green-400/90 hover:bg-green-500'}  rounded-md tracking-wider"
  >
    <div class="mx-auto h-full flex items-center text-slate-50 pl-2">
      {!isReady
        ? "... ready signal"
        : !isAvaMarkAsDone.status
        ? "No mark button"
        : `${isAvaMarkAsDone.count === 0 ? "" : isAvaMarkAsDone.count} ${
            isAvaMarkAsDone.done ? "" : "Un"
          }Mark as Done`}
    </div>
  </button>
</span>
