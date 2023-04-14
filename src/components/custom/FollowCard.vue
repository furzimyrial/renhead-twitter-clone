<template>
  <SideCard title="Who to follow" to="/">
    <Follow
      v-for="follow in follows"
      :name="follow.fullName"
      :username="follow.username"
      :image="follow.image"
      :to="`/user/${follow.id}`"
    />
  </SideCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { SideCard, Follow } from ".";
import { useStore } from "vuex";
import { TUser } from "../../types";
import TwitterApi from "../../api";

const follows = ref<TUser[]>([]);
const store = useStore();

const id = computed(() => store.getters["getUserId"]);

onMounted(async () => {
  const { data } = await TwitterApi.getUsers();
  while (follows.value.length < 3 && data.length) {
    const rand = Math.floor(Math.random() * data.length);
    const users = data.splice(rand, 1);
    if (users.find((x: TUser) => x.id === id.value)) {
      continue;
    }
    follows.value = [...follows.value, ...users];
  }
});
</script>
