<template>
  <div
    class="w-full lg:rounded-2xl overflow-hidden lg:bg-black lg:bg-opacity-5"
  >
    <h2 class="text-xl font-bold px-5 py-3">{{ title }}</h2>
    <div class="w-full">
      <slot />
    </div>
    <RouterLink
      class="w-full block py-3 px-5 text-twitter-blue hover:bg-black hover:bg-opacity-5 text-left"
      :to="to"
    >
      Show more
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

type TProps = {
  title: string;
  to: string;
};

defineProps<TProps>();
</script>
