<template>
  <Teleport to="body">
    <div
      class="fixed left-0 top-0 flex items-end lg:items-center justify-center bg-black bg-opacity-50 w-full h-full z-50"
      v-if="open"
    >
      <div
        class="bg-white rounded-tr-xl rounded-tl-xl lg:rounded-xl w-full max-w-2xl"
      >
        <div class="w-full flex items-center justify-between py-3 px-5">
          <h1 class="text-xl font-bold">{{ title }}</h1>
          <button
            class="hover:bg-twitter-blue hover:bg-opacity-10 rounded-full w-[40px] h-[40px] p-2 text-twitter-blue"
            @click="handleClose"
          >
            <CloseIcon class="w-full h-full" />
          </button>
        </div>
        <div class="pb-3">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CloseIcon } from "../icons";

type TProps = {
  title?: string;
  open: boolean;
};

defineProps<TProps>();
const emit = defineEmits(["modalClose"]);

const handleClose = () => {
  emit("modalClose");
};
</script>
