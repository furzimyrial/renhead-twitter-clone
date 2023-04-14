<template>
  <div class="w-full flex">
    <div class="w-full pb-[200px] md:pb-0">
      <div
        class="w-full sticky top-0 backdrop-blur-lg bg-white bg-opacity-80 border-b border-b-black border-opacity-5 z-10 h-[53px] flex items-center px-2 gap-3"
      >
        <button
          class="hover:bg-gray-600 hover:bg-opacity-10 rounded-full w-[40px] h-[40px] min-w-[40px] p-2 text-gray-500 hover:text-gray-600"
          @click="router.back"
        >
          <BackIcon />
        </button>
        <div class="w-full">
          <h2 class="text-xl text-black font-bold">
            {{ me.fullName }}
          </h2>
          <p class="text-xs text-gray-500">{{ posts.length }} Tweets</p>
        </div>
        <button
          class="block md:hidden hover:bg-gray-600 hover:bg-opacity-10 rounded-full w-[40px] h-[40px] min-w-[40px] p-2 text-gray-500 hover:text-gray-600"
          @click="handleLogout"
        >
          <LogoutIcon />
        </button>
      </div>
      <div class="w-full h-[120px] md:h-[200px] bg-black bg-opacity-5 relative">
        <div
          class="w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-full border border-5 bg-gray-200 border-white overflow-hidden absolute left-5 bottom-0 translate-y-[50%] flex justify-center items-center"
        >
          <span class="text-2xl md:text-4xl font-bold text-gray-500">{{
            getNameInitials(me.fullName)
          }}</span>
          <img
            class="w-full h-full object-cover object-center absolute left-0 top-0"
            :src="me.image"
            v-if="!hasError && me.image"
            @error="hasError = true"
          />
        </div>
      </div>
      <div class="flex justify-end py-2 px-5 md:py-5">
        <Button @click="uploadPhoto">Upload Photo</Button>
      </div>
      <div class="w-full px-5 pb-5 border-b border-black border-opacity-5">
        <h2 class="text-2xl font-bold text-black">
          {{ me.fullName }}
        </h2>
        <h1 class="text-base text-gray-500">@{{ me.username }}</h1>
      </div>
      <Post
        v-for="post in posts"
        :key="post.id"
        :created-at="post.createdAt"
        :id="post.id"
        :description="post.description"
        :user="post.user"
        :image="post.image"
        :comments="post.comments"
        :likes="post.likes"
        @like="handleLike"
        @dislike="handleDislike"
      />
      <EmptyResults v-if="!posts.length" table="Posts" />
    </div>
    <div
      class="hidden lg:block w-[400px] min-w-[400px] border-l border-l-black border-opacity-5"
    >
      <div class="bg-white px-5 py-2 sticky top-0 z-10">
        <Search />
      </div>
      <div class="sticky top-[-220px] p-5 flex flex-col gap-5">
        <FollowCard />
        <TrendsCard />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { Button } from "../components/ui";
import {
  Search,
  FollowCard,
  TrendsCard,
  Post,
  EmptyResults,
} from "../components/custom";
import { BackIcon, LogoutIcon } from "../components/icons";
import { computed, inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getNameInitials } from "../utils/formatters";
import { TPost, TEmitterEvents, TNewPost, TLike } from "../types";
import { Emitter } from "mitt";
import TwitterApi from "../api";
import FileManager from "../utils/file-manager";

const hasError = ref(false);
const posts = ref<TPost[]>([]);
const store = useStore();
const router = useRouter();
const emitter = inject("emitter") as Emitter<TEmitterEvents>;

const me = computed(() => store.getters["getUser"]);

const handleLogout = async () => {
  await store.dispatch("logout");
  router.push("/login");
};

const handleNewPost = async (newPost: TNewPost) => {
  const { data } = await TwitterApi.createPost({
    userId: me.value.id,
    ...newPost,
  });
  const postObject = { ...data, user: me.value, likes: [], comments: [] };
  posts.value = [postObject, ...posts.value];
};

const uploadPhoto = async () => {
  const file = await FileManager.pick({ multiple: false });
  const dataUrl = await FileManager.read(file as File, "data-url");
  const { data } = await TwitterApi.uploadPhoto(dataUrl as string);
  store.dispatch("setPhoto", data.image);
};

const handleLike = async (likeObject: { postId: number; userId: number }) => {
  const { data: like } = await TwitterApi.like(likeObject);
  posts.value = posts.value.map((post: TPost) =>
    post.id === likeObject.postId
      ? { ...post, likes: [...post.likes, like] }
      : post
  );
};

const handleDislike = async (likeObject: {
  id: number;
  postId: number;
  userId: number;
}) => {
  await TwitterApi.dislike(likeObject.id);
  posts.value = posts.value.map((post: TPost) =>
    post.id === likeObject.postId
      ? {
          ...post,
          likes: post.likes.filter((like: TLike) => like.id !== likeObject.id),
        }
      : post
  );
};

const handlePostUpdate = async (newPost: TPost) => {
  const { id, description, image } = newPost;
  await TwitterApi.editPost(id, { description, image });
  posts.value = posts.value.map((post) =>
    post.id === id ? { ...post, description, image } : post
  );
};

onMounted(async () => {
  const { data } = await TwitterApi.getUserPosts(me.value.id);
  posts.value = data;
  emitter.on("newPost", handleNewPost);
  emitter.on("postUpdate", handlePostUpdate);
});
</script>
