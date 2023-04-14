<template>
  <div
    class="flex items-start px-5 py-3 gap-3 border-b border-b-black border-opacity-5 hover:bg-twitter-blue hover:bg-opacity-5 cursor-pointer"
    @click="router.push(`/user/${user.id}/post/${id}`)"
  >
    <Avatar
      :image="user.image"
      :name="`${user.fullName}`"
      @click.stop="router.push(`/user/${user.id}`)"
    />
    <div class="w-full flex flex-col gap-5">
      <div class="w-full flex gap-5">
        <div class="w-full">
          <div class="w-full">
            <div
              class="font-bold inline-block mr-2"
              @click.stop="router.push(`/user/${user.id}`)"
            >
              {{ user.fullName }}
            </div>
            <div
              class="font-light inline-block mr-2 text-gray-600"
              @click.stop="router.push(`/user/${user.id}`)"
            >
              @{{ user.username }}
            </div>
            <div class="font-light inline-block text-gray-600">
              • {{ twitterFromNowFormat(createdAt) }}
            </div>
          </div>
          <div class="w-full">
            {{ description }}
          </div>
        </div>
        <Menu :items="postMenuitems" @click.stop v-if="canChange">
          <button
            class="hover:bg-twitter-blue hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 text-gray-600 hover:text-twitter-blue"
          >
            <DotsIcon class="w-[18px] h-[18px] min-w-[18px]" /></button
        ></Menu>
      </div>
      <div
        class="w-full rounded-lg pb-[60%] overflow-hidden bg-black bg-opacity-5 relative"
        v-if="image"
      >
        <img
          class="absolute left-0 top-0 object-cover object-center w-full h-full"
          :src="image"
          alt="Post Image"
        />
      </div>
      <div class="w-full flex">
        <div class="w-full flex items-center gap-1">
          <button
            class="hover:bg-twitter-blue hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 text-gray-500 hover:text-twitter-blue"
            @click.stop
          >
            <CommentIcon />
          </button>
          <span class="text-xs text-gray-500">{{
            twitterNumberFormat(comments.length)
          }}</span>
        </div>
        <div class="w-full flex items-center gap-1">
          <button
            class="hover:bg-green-500 hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 text-gray-500 hover:text-green-500"
            @click.stop
          >
            <RetweetIcon />
          </button>
          <span class="text-xs text-gray-500">{{
            twitterNumberFormat(63)
          }}</span>
        </div>
        <div class="w-full flex items-center gap-1">
          <button
            class="hover:bg-red-500 hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 hover:text-red-500"
            :class="{
              'text-red-500': liked,
              'text-gray-500': !liked,
            }"
            @click.stop="handleLike"
          >
            <LikeIcon :active="liked" />
          </button>
          <span
            class="text-xs"
            :class="{
              'text-red-500': liked,
              'text-gray-500': !liked,
            }"
            >{{ twitterNumberFormat(likes.length) }}</span
          >
        </div>
        <div class="hidden w-full md:flex items-center gap-1">
          <button
            class="hover:bg-twitter-blue hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 text-gray-500 hover:text-twitter-blue"
            @click.stop
          >
            <AnalyticIcon />
          </button>
          <span class="text-xs text-gray-500">{{
            twitterNumberFormat(236800)
          }}</span>
        </div>
        <div class="hidden w-full xl:flex items-center gap-1">
          <button
            class="hover:bg-twitter-blue hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 text-gray-500 hover:text-twitter-blue"
            @click.stop
          >
            <ShareIcon />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  CommentIcon,
  DotsIcon,
  LikeIcon,
  RetweetIcon,
  AnalyticIcon,
  ShareIcon,
} from "../icons";
import { useRouter } from "vue-router";
import { computed, inject } from "vue";
import { Avatar, Menu } from "../ui";
import {
  twitterFromNowFormat,
  twitterNumberFormat,
} from "../../utils/formatters";
import { useStore } from "vuex";
import { TMenuItem, TEmitterEvents, TUser } from "../../types";
import { Emitter } from "mitt";
import { TComment } from "../../types";
import { TLike } from "../../types";

const store = useStore();

type TProps = {
  id: number;
  user: TUser;
  image: string;
  description: string;
  createdAt: string;
  likes: TLike[];
  comments: TComment[];
};

const emitter = inject("emitter") as Emitter<TEmitterEvents>;
const props = defineProps<TProps>();
const emit = defineEmits(["like", "dislike", "deletePost"]);

const me = computed(() => store.getters["getUser"]);

const liked = computed(() => {
  return !!props.likes.find((like) => like.userId === me.value.id);
});
const canChange = computed(() => props.user.id === me.value.id);

const postMenuitems: TMenuItem[] = [
  {
    label: "Edit post",
    action: (close) => {
      const postObject = {
        id: props.id,
        description: props.description,
        image: props.image,
      };
      emitter.emit("editPost", postObject);
      close();
    },
  },
  {
    label: "Delete post",
    action: (close) => {
      emit("deletePost", props.id);
      close();
    },
  },
];

const handleLike = () => {
  if (!liked.value) {
    const likeObject = {
      postId: props.id,
      userId: me.value.id,
    };
    emit("like", likeObject);
  } else {
    const likeObject = props.likes.find((like) => like.userId === me.value.id);
    emit("dislike", likeObject);
  }
};

const router = useRouter();
</script>
