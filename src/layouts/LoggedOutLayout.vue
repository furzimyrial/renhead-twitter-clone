<template>
  <div class="w-full flex min-h-screen">
    <div
      class="w-full bg-gradient-to-r from-twitter-blue to-twitter-blue relative hidden md:block"
    >
      <div class="w-full h-full absolute left-0 top-0">
        <video
          class="w-full h-full object-cover object-center opacity-40 pointer-events-none"
          src="../assets/video/nature-timelapse.mp4"
          muted
          autoplay
          loop
        ></video>
      </div>
    </div>
    <div
      class="w-full md:max-w-[500px] bg-white flex items-center p-5 sm:p-10 md:p-20"
    >
      <div class="w-full flex flex-col items-center gap-2">
        <TwitterIcon class="text-twitter-blue w-[60px] h-[60px]" />
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { TwitterIcon } from "../components/icons";
</script>
