<template>
  <div class="w-full flex">
    <div class="w-full">
      <div
        class="w-full sticky top-0 backdrop-blur-lg bg-white bg-opacity-80 border-b border-b-black border-opacity-5 z-10"
      >
        <h2 class="h-[53px] p-3 m-0 text-xl font-bold">
          {{ $route.meta.title }}
        </h2>
      </div>
      <EmptyPage :page="$route.meta.title" />
    </div>
    <div
      class="hidden md:block w-[400px] min-w-[400px] border-l border-l-black border-opacity-5"
    >
      <div class="bg-white px-5 py-2 sticky top-0 z-10">
        <Search />
      </div>
      <div class="sticky top-[-100%] p-5 flex flex-col gap-5">
        <TrendsCard />
        <FollowCard />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  Search,
  EmptyPage,
  TrendsCard,
  FollowCard,
} from "../components/custom";
</script>
