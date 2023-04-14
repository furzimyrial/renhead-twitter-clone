<template>
  <div class="py-20 px-5 flex flex-col gap-5 items-center">
    <h2 class="text-xl text-black text-center font-bold">
      Page is currently unavailable
    </h2>
    <p class="text-sm text-gray-400 text-center">
      Page "<span class="text-twitter-blue">{{ page }}</span
      >" is currently unavailabe and we are trying to fix it.
    </p>
  </div>
</template>
<script setup lang="ts">
defineProps(["page"]);
</script>
