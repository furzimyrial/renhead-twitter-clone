<template>
  <div
    class="flex items-start px-5 py-3 gap-3 border-b border-b-black border-opacity-5"
    :class="{
      'bg-twitter-blue bg-opacity-10': props.editing,
    }"
  >
    <Avatar
      class="cursor-pointer"
      :image="user.image"
      :name="`${user.fullName}`"
      @click="router.push(`/user/${user.id}`)"
    />
    <div class="w-full flex flex-col gap-5">
      <div class="w-full flex gap-5">
        <div class="w-full">
          <div class="w-full">
            <div
              class="font-bold inline-block mr-2 cursor-pointer"
              @click="router.push(`/user/${user.id}`)"
            >
              {{ user.fullName }}
            </div>
            <div
              class="font-light inline-block mr-2 text-gray-600 cursor-pointer"
              @click="router.push(`/user/${user.id}`)"
            >
              @{{ user.username }}
            </div>
            <div class="font-light inline-block text-gray-600">
              • {{ twitterFromNowFormat(createdAt) }}
            </div>
          </div>
          <div class="w-full">
            {{ text }}
          </div>
        </div>
        <Menu :items="commentMenuItems" v-if="canChange">
          <button
            class="hover:bg-twitter-blue hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 text-gray-600 hover:text-twitter-blue"
          >
            <DotsIcon class="w-[18px] h-[18px] min-w-[18px]" />
          </button>
        </Menu>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DotsIcon } from "../icons";
import { Avatar, Menu } from "../ui";
import { twitterFromNowFormat } from "../../utils/formatters";
import { useStore } from "vuex";
import { TMenuItem, TUser } from "../../types";
import { useRouter } from "vue-router";
import { computed } from "vue";

type TProps = {
  user: TUser;
  text: string;
  createdAt: string;
  postCreator: boolean;
  id: number;
  editing: boolean;
};

const props = defineProps<TProps>();
const emit = defineEmits(["editComment", "deleteComment"]);
const store = useStore();
const router = useRouter();

const me = computed(() => store.getters["getUser"]);
const canChange = computed(
  () => props.user.id === me.value.id || props.postCreator
);

const commentMenuItems: TMenuItem[] = [
  {
    label: "Edit comment",
    action: (close: any) => {
      emit("editComment", props.id);
      close();
    },
  },
  {
    label: "Delete comment",
    action: (close: any) => {
      emit("deleteComment", props.id);
      close();
    },
  },
];
</script>
