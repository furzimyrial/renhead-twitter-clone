<template>
  <div
    class="bg-white z-10 flex flex-col justify-between md:min-h-screen w-full md:w-[260px] md:min-w-[260px] border-t md:border-t-0 md:border-r border-r-black border-opacity-5 px-5 py-2 fixed bottom-0 md:top-0 md:bottom-auto"
  >
    <div class="flex flex-col">
      <RouterLink
        class="rounded-full hidden md:block p-3 w-[50px] h-[50px] mb-3 text-twitter-blue hover:bg-black hover:bg-opacity-10 transition-colors ease-in-out duration-300"
        to="/"
      >
        <TwitterIcon class="w-full h-full" />
      </RouterLink>
      <div class="flex md:flex-col gap-1 items-start w-full md:w-auto">
        <RouterLink
          :to="navItem.to"
          class="w-full flex md:w-auto rounded-full md:flex justify-center items-center md:gap-3 px-3 py-2.5 pr-5 text-gray-900 hover:bg-black hover:bg-opacity-10 transition-colors ease-in-out duration-300 [&.active]:font-medium text-xl"
          :class="{
            'hidden md:flex': !navItem.mobile,
          }"
          active-class="active"
          v-for="navItem in navItems"
        >
          <component
            class="w-[24px] h-[24px]"
            :is="navItem.icon"
            :active="navItem.to === route.path"
          />
          <span class="hidden md:inline">{{ navItem.label }}</span>
        </RouterLink>
        <Button
          class="fixed w-[50px] h-[50px] py-0 px-0 flex items-center justify-center md:static bottom-[80px] right-5 md:w-full mt-5"
          @click="modalOpen = true"
        >
          <span class="hidden md:inline">Tweet</span>
          <PostIcon class="w-[24px] h-[24px] md:hidden" />
        </Button>
        <Modal
          title="Create a new Tweet"
          :open="modalOpen"
          @modal-close="handleModalClose"
        >
          <CreatePost
            @on-new-post="handleNewPost"
            :edit="edit"
            @on-post-update="handlePostUpdate"
          />
        </Modal>
      </div>
    </div>
    <Menu :items="userMenuItems" position="top-left">
      <div
        class="w-full rounded-full hidden md:flex gap-2 hover:bg-black hover:bg-opacity-10 transition-colors p-3 items-center cursor-pointer"
        v-if="me"
      >
        <Avatar :image="me.image" :name="me.fullName" />
        <div class="w-full whitespace-nowrap text-ellipsis overflow-hidden">
          <div
            class="w-full text-sm font-bold text-black whitespace-nowrap text-ellipsis overflow-hidden"
          >
            {{ me.fullName }}
          </div>
          <div
            class="w-full text-sm font-light text-gray-600 whitespace-nowrap text-ellipsis overflow-hidden"
          >
            @{{ me.username }}
          </div>
        </div>
        <DotsIcon class="w-[18px] h-[18px] min-w-[18px] text-gray-600" />
      </div>
    </Menu>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from "vue-router";
import { Avatar, Button, Menu, Modal } from "../ui";
import { CreatePost } from ".";
import {
  HomeIcon,
  ExploreIcon,
  NotificationIcon,
  MessageIcon,
  BookmarkIcon,
  TwitterBlueIcon,
  ProfileIcon,
  MoreIcon,
  TwitterIcon,
  DotsIcon,
  PostIcon,
} from "../icons";
import { useStore } from "vuex";
import { computed, inject, onMounted, ref } from "vue";
import { Emitter } from "mitt";
import { TNewPost, TEmitterEvents, TPost, TMenuItem } from "../../types";

const modalOpen = ref(false);

const route = useRoute();
const router = useRouter();
const store = useStore();
const edit = ref<TPost | null>(null);
const emitter = inject("emitter") as Emitter<TEmitterEvents>;

const handleLogout = async () => {
  await store.dispatch("logout");
  router.push("/login");
};

const handleNewPost = (newPost: TNewPost) => {
  modalOpen.value = false;
  emitter.emit("newPost", newPost);
};

const handlePostUpdate = (newPost: TPost) => {
  edit.value = null;
  modalOpen.value = false;
  emitter.emit("postUpdate", newPost);
};

const handleModalClose = () => {
  modalOpen.value = false;
  edit.value = null;
};

const me = computed(() => store.getters["getUser"]);

const handleEditPost = (newPost: TPost) => {
  modalOpen.value = true;
  edit.value = newPost;
};

onMounted(() => {
  emitter.on("editPost", handleEditPost);
});

const userMenuItems: TMenuItem[] = [
  {
    label: "Profile",
    action: (close) => {
      router.push("/profile");
      close();
    },
  },
  {
    label: "Logout",
    action: (close) => {
      handleLogout();
      close();
    },
  },
];

const navItems = [
  {
    to: "/",
    label: "Home",
    icon: HomeIcon,
    mobile: true,
  },
  {
    to: "/explore",
    label: "Explore",
    icon: ExploreIcon,
    mobile: false,
  },
  {
    to: "/notifications",
    label: "Notifications",
    icon: NotificationIcon,
    mobile: true,
  },
  {
    to: "/messages",
    label: "Messages",
    icon: MessageIcon,
    mobile: true,
  },
  {
    to: "/bookmarks",
    label: "Bookmarks",
    icon: BookmarkIcon,
    mobile: false,
  },
  {
    to: "/twitter-blue",
    label: "Twitter Blue",
    icon: TwitterBlueIcon,
    mobile: false,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: ProfileIcon,
    mobile: true,
  },
  {
    to: "/more",
    label: "More",
    icon: MoreIcon,
    mobile: false,
  },
];
</script>
