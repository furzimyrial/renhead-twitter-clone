<template>
  <button
    class="text-center rounded-full text-white px-4 py-2 md:px-5 md:py-2.5 font-bold text-sm md:text-base disabled:opacity-50 disabled:pointer-events-none select-none"
    :class="{
      'bg-twitter-blue hover:bg-twitter-darkblue': variant === 'primary',
      'bg-black hover:bg-gray-900': variant === 'secondary',
    }"
  >
    <slot />
  </button>
</template>
<script setup lang="ts">
type TProps = {
  variant?: "primary" | "secondary";
};

withDefaults(defineProps<TProps>(), {
  variant: "primary",
});
</script>
