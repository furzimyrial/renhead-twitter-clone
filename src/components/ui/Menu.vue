<template>
  <div class="relative inline">
    <div class="inline" @click="open = !open" ref="buttonRef"><slot /></div>
    <div
      class="absolute bg-white z-50 shadow-lg border border-black border-opacity-5 rounded-xl width-fix"
      :class="{
        'top-[100%] right-0': position === 'bottom-right',
        'top-[100%] left-0': position === 'bottom-left',
        'bottom-[100%] right-0': position === 'top-right',
        'bottom-[100%] left-0': position === 'top-left',
      }"
      ref="menuRef"
      v-if="open && items.length"
    >
      <button
        v-for="item in items"
        @click="handleItem(item.action)"
        class="px-5 py-2 hover:bg-twitter-blue hover:bg-opacity-5 w-full border-b border-black border-opacity-5"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { TMenuItem } from "../../types";

const open = ref(false);

const buttonRef = ref();
const menuRef = ref();

const trackClick = (e: Event) => {
  if (
    e.target === buttonRef.value ||
    buttonRef.value.contains(e.target) ||
    e.target === menuRef.value ||
    menuRef.value?.contains(e.target)
  ) {
    return;
  }
  open.value = false;
};

const closeMenuFunction = () => {
  open.value = false;
};

const handleItem = (action: any) => {
  action(closeMenuFunction);
};

onMounted(() => {
  window.addEventListener("click", trackClick);
});

onUnmounted(() => {
  window.removeEventListener("click", trackClick);
});

type TProps = {
  items: TMenuItem[];
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

withDefaults(defineProps<TProps>(), {
  position: "bottom-right",
});
</script>
<style scoped>
.width-fix {
  min-width: max(100%, 200px);
}
</style>
