import { SearchIcon } from '../icons';

<template>
  <Menu :items="searchResults">
    <div class="relative w-full">
      <input
        @input="handleInput"
        type="text"
        placeholder="Search Twitter"
        class="peer w-full py-2 px-12 outline-none border border-transparent focus:border-twitter-blue rounded-full bg-black bg-opacity-5 focus:bg-transparent"
      />
      <SearchIcon
        class="w-[16px] h-[16px] absolute left-[25px] top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-twitter-blue"
      />
    </div>
  </Menu>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { SearchIcon } from "../icons";
import { Menu } from "../ui";
import TwitterApi from "../../api";
import { TMenuItem, TUser } from "../../types";
import { useRouter } from "vue-router";

const router = useRouter();

const handleInput = async (e: Event) => {
  const el = e.target as HTMLInputElement;
  const { data } = await TwitterApi.searchUsers(el.value);
  searchResults.value = data.map(
    (user: TUser) =>
      ({
        label: user.fullName,
        action: (close) => {
          router.push(`/user/${user.id}`);
          close();
        },
      } as TMenuItem)
  );
};

const searchResults = ref([]);
</script>
