<template>
  <div
    class="w-[50px] h-[50px] min-w-[50px] rounded-full overflow-hidden flex items-center justify-center text-center bg-gray-200 relative"
  >
    <span class="text-xl font-bold text-gray-500">{{ initials }}</span>
    <img
      @error="badImage = true"
      class="w-full h-full object-cover object-center absolute left-0 top-0"
      :src="image"
      alt="Avatar"
      v-if="!badImage && image"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { getNameInitials } from "../../utils/formatters";
type TProps = {
  image?: string;
  name?: string;
};

const badImage = ref(false);
const props = defineProps<TProps>();

const initials = computed(() => {
  const name = props.name || "";
  return getNameInitials(name);
});
</script>
