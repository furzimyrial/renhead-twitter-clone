<template>
  <RouterLink
    :to="to"
    class="w-full flex items-start px-5 py-2 hover:bg-black hover:bg-opacity-5 gap-5"
  >
    <div class="w-full">
      <div class="text-xs text-gray-600">{{ tag }}</div>
      <div class="text-base text-black font-bold">{{ title }}</div>
      <div class="text-xs text-gray-600">
        {{ twitterNumberFormat(count) }}
        Tweets
      </div>
    </div>
    <button
      class="hover:bg-twitter-blue hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 text-gray-600 hover:text-twitter-blue"
    >
      <DotsIcon class="w-[18px] h-[18px] min-w-[18px]" />
    </button>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { DotsIcon } from "../icons";
import { twitterNumberFormat } from "../../utils/formatters";

defineProps({
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
});
</script>
