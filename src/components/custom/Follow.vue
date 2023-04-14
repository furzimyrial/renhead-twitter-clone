<template>
  <RouterLink
    :to="to"
    class="w-full flex px-5 py-2 hover:bg-black hover:bg-opacity-5 gap-5 items-center"
  >
    <div class="w-full flex items-center gap-2">
      <Avatar :image="image" :name="name" />
      <div class="w-full whitespace-nowrap text-ellipsis overflow-hidden">
        <div
          class="w-full text-sm font-bold whitespace-nowrap text-ellipsis overflow-hidden"
        >
          {{ name }}
        </div>
        <div
          class="w-full text-sm text-gray-400 whitespace-nowrap text-ellipsis overflow-hidden"
        >
          @{{ username }}
        </div>
      </div>
    </div>
    <Button variant="secondary"> Open </Button>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Avatar, Button } from "../ui";

type TProps = {
  name: string;
  username: string;
  image?: string;
  to: string;
};

defineProps<TProps>();
</script>
