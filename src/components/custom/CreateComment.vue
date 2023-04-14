<template>
  <div class="px-5 py-2 flex gap-2">
    <Avatar :image="me.image" :name="me.fullName" />
    <div class="flex flex-col w-full">
      <textarea
        @input="handleInput"
        class="text-xl placeholder:font-thin outline-none w-full h-[50px] min-h-[50px] max-h-[200px] p-2 resize-none mb-3"
        placeholder="Tweet your reply"
        v-model="comment"
      />
      <div class="flex justify-end items-center">
        <Button @click="handleComment" :disabled="isDisabled">{{
          props.edit ? "Save" : "Comment"
        }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Avatar, Button } from "../ui";
import { useStore } from "vuex";
import { TComment } from "../../types";

type TProps = {
  edit: TComment | null;
};

const props = defineProps<TProps>();

const comment = ref("");

const emit = defineEmits(["onNewComment", "onEditComment"]);

const store = useStore();

const me = computed(() => store.getters["getUser"]);
const isDisabled = computed(() => !!!comment.value.trim());

const handleComment = async () => {
  if (props.edit) {
    emit("onEditComment", { ...props.edit, text: comment.value });
  } else {
    emit("onNewComment", comment.value);
  }
  comment.value = "";
};

watch(
  () => props.edit,
  () => {
    if (props.edit) comment.value = props.edit.text;
  }
);

const handleInput = (e: Event) => {
  const el = e.target as HTMLInputElement;
  el.style.height = "5px";
  el.style.height = `${el.scrollHeight}px`;
};
</script>
