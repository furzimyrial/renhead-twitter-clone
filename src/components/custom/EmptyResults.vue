<template>
  <div
    class="min-h-[300px] lg:min-h-0 justify-center lg:mb-0 py-20 px-5 flex flex-col gap-5 items-center"
  >
    <h2 class="text-xl text-black text-center font-bold">No results</h2>
    <p class="text-sm text-gray-400 text-center">
      Looks like there are no currently results for "<span
        class="text-twitter-blue"
        >{{ table }}</span
      >"
    </p>
  </div>
</template>
<script setup lang="ts">
defineProps(["table"]);
</script>
