<template>
  <div class="md:container flex flex-row w-full relative">
    <Navbar />
    <div class="w-full md:ml-[260px] pb-[100px] lg:pb-0">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "../components/custom/Navbar.vue";
</script>
