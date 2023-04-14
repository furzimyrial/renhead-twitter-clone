<template>
  <div class="w-full flex" v-if="!!user && !!post">
    <div class="w-full">
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
          <h2 class="text-xl text-black font-bold">Tweet</h2>
        </div>
      </div>
      <div class="w-full p-5 border-b border-black border-opacity-5">
        <div class="w-full flex gap-5 justify-between mb-5">
          <div class="w-full flex gap-2 items-center">
            <Avatar
              class="cursor-pointer"
              :name="user.fullName"
              :image="user.image"
              @click.stop="router.push(`/user/${user?.id}`)"
            />
            <div class="w-full">
              <div
                class="font-bold cursor-pointer"
                @click.stop="router.push(`/user/${user?.id}`)"
              >
                {{ user.fullName }}
              </div>
              <div
                class="font-light text-gray-600 cursor-pointer"
                @click.stop="router.push(`/user/${user?.id}`)"
              >
                @{{ user.username }}
              </div>
            </div>
          </div>
          <Menu :items="postMenuItems" v-if="canChange">
            <button
              class="hover:bg-twitter-blue hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 text-gray-600 hover:text-twitter-blue"
            >
              <DotsIcon class="w-[18px] h-[18px] min-w-[18px]" />
            </button>
          </Menu>
        </div>
        <div class="w-full mb-5" v-if="post.description">
          {{ post.description }}
        </div>
        <div class="w-full mb-5 rounded-xl overflow-hidden" v-if="post.image">
          <img class="w-full" :src="post.image" />
        </div>
        <div class="w-full flex gap-5">
          <div class="text-sm text-gray-500">
            <span class="font-bold text-black">{{
              twitterNumberFormat(15)
            }}</span>
            Retweets
          </div>
          <div class="text-sm text-gray-500">
            <span class="font-bold text-black">{{
              twitterNumberFormat(616)
            }}</span>
            Quotes
          </div>
          <div class="text-sm text-gray-500">
            <span class="font-bold text-black">{{
              twitterNumberFormat(post.likes.length)
            }}</span>
            Likes
          </div>
          <div class="text-sm text-gray-500">
            <span class="font-bold text-black">{{
              twitterNumberFormat(52)
            }}</span>
            Bookmarks
          </div>
        </div>
      </div>
      <div
        class="w-full flex gap-5 border-t border-b border-black border-opacity-5 justify-around px-5 py-2"
      >
        <button
          class="hover:bg-twitter-blue hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 text-gray-500 hover:text-twitter-blue"
          @click.stop
        >
          <CommentIcon />
        </button>
        <button
          class="hover:bg-green-500 hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 text-gray-500 hover:text-green-500"
          @click.stop
        >
          <RetweetIcon />
        </button>
        <button
          class="hover:bg-red-500 hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 hover:text-red-500"
          :class="{
            'text-red-500': liked,
            'text-gray-500': !liked,
          }"
          @click="handleLike"
        >
          <LikeIcon :active="liked" />
        </button>
        <button
          class="hover:bg-twitter-blue hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 text-gray-500 hover:text-twitter-blue"
          @click.stop
        >
          <AnalyticIcon />
        </button>
        <button
          class="hover:bg-twitter-blue hover:bg-opacity-10 rounded-full w-[34px] h-[34px] p-2 text-gray-500 hover:text-twitter-blue"
          @click.stop
        >
          <ShareIcon />
        </button>
      </div>
      <CreateComment
        class="border-b border-black border-opacity-5"
        :edit="editComment"
        @on-new-comment="handleComment"
        @on-edit-comment="handleEdit"
      />
      <Comment
        v-for="comment in comments"
        :editing="comment.id === editComment?.id"
        :id="comment.id"
        :user="comment.user"
        :created-at="comment.createdAt"
        :text="comment.text"
        :post-creator="postCreator"
        @edit-comment="handleCommentEdit"
        @delete-comment="handleCommentDelete"
      />
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
import { Avatar, Button, Menu } from "../components/ui";
import {
  Search,
  FollowCard,
  TrendsCard,
  CreateComment,
  Comment,
} from "../components/custom";
import {
  AnalyticIcon,
  BackIcon,
  CommentIcon,
  DotsIcon,
  LikeIcon,
  RetweetIcon,
  ShareIcon,
} from "../components/icons";
import { computed, inject, onMounted, ref, watch } from "vue";
import TwitterApi from "../api";
import { useRoute, useRouter } from "vue-router";
import { twitterNumberFormat } from "../utils/formatters";
import {
  TComment,
  TEmitterEvents,
  TLike,
  TMenuItem,
  TPost,
  TUser,
} from "../types";
import { Emitter } from "mitt";
const post = ref<null | TPost>(null);
const user = ref<null | TUser>(null);
const comments = ref<TComment[]>([]);
const editComment = ref<TComment | null>(null);
const emitter = inject("emitter") as Emitter<TEmitterEvents>;
const store = useStore();
const route = useRoute();
const router = useRouter();

const postMenuItems: TMenuItem[] = [
  {
    label: "Edit post",
    action: async (close) => {
      if (post.value) {
        const postObject = {
          id: post.value.id,
          description: post.value.description,
          image: post.value.image,
        };
        emitter.emit("editPost", postObject);
      }
      close();
    },
  },
  {
    label: "Delete post",
    action: async (close) => {
      if (post.value) {
        await TwitterApi.deletePost(post.value.id);
        router.push("/");
      }
      close();
    },
  },
];

const handleCommentEdit = (commentId: number) => {
  const comment = comments.value.find((comment) => comment.id === commentId);

  if (!comment) return;
  editComment.value = comment;
};

const handleCommentDelete = async (commentId: number) => {
  if (editComment.value?.id === commentId) {
    editComment.value = null;
  }
  await TwitterApi.deleteComment(commentId);
  comments.value = comments.value.filter((comment) => comment.id !== commentId);
};

const handleEdit = async ({ id, text }: TComment) => {
  await TwitterApi.editComment(id, text);
  comments.value = comments.value.map((comment) =>
    comment.id === id ? { ...comment, text } : comment
  );
  editComment.value = null;
};

const me = computed(() => store.getters["getUser"]);
const liked = computed(() => {
  return !!post.value?.likes.find((like: TLike) => like.userId === me.value.id);
});
const postCreator = computed(() => {
  return post.value?.userId === me.value.id;
});
const canChange = computed(
  () => post.value?.userId === me.value.id && postCreator.value
);

const getData = async () => {
  const userId = Number(route.params.id);
  const postId = Number(route.params.postId);

  const { data: userData } = await TwitterApi.getSingleUser(userId);
  user.value = userData;

  const { data: postData } = await TwitterApi.getPost(postId);
  post.value = postData;

  const { data: commentData } = await TwitterApi.getComments(postId);
  comments.value = commentData;

  emitter.on("postUpdate", handlePostUpdate);
};

const handleComment = async (text: string) => {
  const postId = Number(route.params.postId);
  const { data: commentData } = await TwitterApi.createComment(
    me.value.id,
    postId,
    text
  );
  const newComment = { ...commentData, user: me.value };
  comments.value = [newComment, ...comments.value];
};

const handlePostUpdate = async (newPost: TPost) => {
  const { id, description, image } = newPost;
  await TwitterApi.editPost(id, { description, image });
  if (post.value) {
    post.value.description = newPost.description;
    post.value.image = newPost.image;
  }
};

const handleLike = async () => {
  if (post.value === null) return;
  if (!liked.value) {
    const likeObject = { postId: post.value.id, userId: me.value.id };
    const { data: like } = await TwitterApi.like(likeObject);
    post.value.likes = [...post.value.likes, like];
  } else {
    const likeObject = post.value.likes.find(
      (like: TLike) => like.userId === me.value.id
    );

    if (!likeObject) return;

    await TwitterApi.dislike(likeObject.id);
    post.value.likes = post.value.likes.filter(
      (like: TLike) => like.id !== likeObject.id
    );
  }
};

onMounted(getData);

watch(() => [route.params.id, route.params.postId], getData);
</script>
