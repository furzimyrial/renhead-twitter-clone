<template>
  <div class="w-full flex flex-col items-start gap-1">
    <label class="text-xs text-gray-400 font-medium"
      >{{ label }}
      <span class="text-twitter-blue" v-if="required">*</span></label
    >
    <input
      class="w-full border border-black border-opacity-20 rounded-xl px-5 py-3 focus:outline focus:outline-2 focus:outline-twitter-blue"
      :class="{
        'outline outline-2 outline-red-500': errorMessage && showErrors,
      }"
      :value="value || modelValue"
      @input="handleInput"
      @blur="handleBlur"
      v-bind="$attrs"
    />
    <span v-if="errorMessage && showErrors" class="text-xs text-red-500">{{
      errorMessage
    }}</span>
  </div>
</template>
<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { ref } from "vue";

type TProps = {
  modelValue?: string;
  label: string;
  required?: boolean;
  value?: string;
  validators?: Array<{
    message: string;
    validatorFunction: (v: string) => boolean;
  }>;
};

const showErrors = ref<boolean>(false);

const props = defineProps<TProps>();

const emit = defineEmits(["update:modelValue", "input", "blur"]);

const handleBlur = (e: Event) => {
  showErrors.value = true;
  emit("blur", e);
};

const handleInput = (e: Event) => {
  const el = e.target as HTMLInputElement;

  showErrors.value = false;

  emit("update:modelValue", el.value);
  emit("input", e);
};

const errorMessage = computed(() => {
  const { validators } = props;

  if (!validators || !validators.length) return null;

  const value = props.value || props.modelValue || "";

  const validator = validators.find((v) => !v.validatorFunction(value));

  if (!validator) return null;

  return validator.message;
});
</script>
