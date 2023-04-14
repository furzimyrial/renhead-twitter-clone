<template>
  <div class="w-full flex flex-col lg:flex-row">
    <div class="w-full">
      <div
        class="w-full sticky top-0 backdrop-blur-lg bg-white bg-opacity-80 border-b border-b-black border-opacity-5 z-10"
      >
        <h2 class="h-[53px] p-3 m-0 text-xl font-bold">
          {{ $route.meta.title }}
        </h2>
        <div class="w-full flex">
          <div
            @click="() => (activeTab = 'for-you')"
            class="group w-full flex justify-center items-center flex-col cursor-pointer hover:bg-black hover:bg-opacity-10 transition-colors ease-in-out duration-300 select-none"
            :class="{
              'text-black font-bold tab': activeTab === 'for-you',
              'text-gray-500': activeTab !== 'for-you',
            }"
          >
            <span
              class="h-[53px] flex items-center relative after:content-[none] group-[&.tab]:after:content-[''] group-[&.tab]:after:absolute after:bottom-0 after:left-0 after:bg-twitter-blue after:rounded-full after:w-full after:h-[4px]"
              >For you</span
            >
          </div>
          <div
            @click="() => (activeTab = 'following')"
            class="group w-full flex justify-center items-center flex-col cursor-pointer hover:bg-black hover:bg-opacity-10 transition-colors ease-in-out duration-300 select-none"
            :class="{
              'text-black font-bold tab': activeTab === 'following',
              'text-gray-500': activeTab !== 'following',
            }"
          >
            <span
              class="h-[53px] flex items-center relative after:content-[none] group-[&.tab]:after:content-[''] group-[&.tab]:after:absolute after:bottom-0 after:left-0 after:bg-twitter-blue after:rounded-full after:w-full after:h-[4px]"
              >Following</span
            >
          </div>
        </div>
      </div>
      <CreatePost
        class="hidden md:flex justify-start border-b border-b-black border-opacity-5"
        @on-new-post="handleNewPost"
      />
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
        @delete-post="handleDelete"
      />
      <EmptyResults v-if="!posts.length" table="Posts" />
    </div>
    <div
      class="block w-full lg:w-[400px] lg:min-w-[400px] lg:border-l border-l-black border-opacity-5"
    >
      <div class="hidden lg:block bg-white px-5 py-2 lg:sticky top-0 z-10">
        <Search class="hidden lg:block" />
      </div>
      <div class="sticky top-[-220px] lg:p-5 flex flex-col gap-5">
        <TrendsCard />
        <FollowCard />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from "vue";
import {
  CreatePost,
  Search,
  TrendsCard,
  Post,
  FollowCard,
  EmptyResults,
} from "../components/custom";
import TwitterApi from "../api";
import { useStore } from "vuex";
import { Emitter } from "mitt";
import { TFollower, TLike, TNewPost, TPost, TEmitterEvents } from "../types";

const posts = ref<TPost[]>([]);
const store = useStore();
const emitter = inject("emitter") as Emitter<TEmitterEvents>;
const activeTab = ref<"for-you" | "following">("for-you");

const me = computed(() => store.getters["getUser"]);

const handleNewPost = async (newPost: TNewPost) => {
  const { data } = await TwitterApi.createPost({
    userId: me.value.id,
    ...newPost,
  });
  const postObject: TPost = {
    ...data,
    user: me.value,
    likes: [],
    comments: [],
  };
  posts.value = [postObject, ...posts.value];
};

const handlePostUpdate = async (newPost: TPost) => {
  const { id, description, image } = newPost;
  await TwitterApi.editPost(id, { description, image });
  posts.value = posts.value.map((post) =>
    post.id === id ? { ...post, description, image } : post
  );
};

const getFollowingPosts = async () => {
  const { data: followerData } = await TwitterApi.getFollowersByUserId(
    me.value.id
  );
  const followerIds = followerData.map((x: TFollower) => x.followerId);
  const { data: postsData } = await TwitterApi.getSpecificPosts(
    followerIds.length ? followerIds : [-1]
  );
  posts.value = postsData;
};

const handleDelete = async (postId: number) => {
  await TwitterApi.deletePost(postId);
  posts.value = posts.value.filter((post) => post.id !== postId);
};

const getPosts = async () => {
  const { data } = await TwitterApi.getPosts();
  posts.value = data;
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

onMounted(async () => {
  if (activeTab.value === "for-you") {
    await getPosts();
  } else {
    await getFollowingPosts();
  }

  emitter.on("newPost", handleNewPost);
  emitter.on("postUpdate", handlePostUpdate);
});

watch(
  () => activeTab.value,
  async () => {
    if (activeTab.value === "for-you") {
      await getPosts();
    } else {
      await getFollowingPosts();
    }
  }
);
</script>
