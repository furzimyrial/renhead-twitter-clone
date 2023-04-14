<template>
  <SideCard title="Trends for you" to="/">
    <Trend
      v-for="(trend, index) in trends"
      :tag="trend.tag"
      :title="trend.title"
      :count="trend.count"
      :key="index"
      to="/"
    />
  </SideCard>
</template>

<script setup lang="ts">
import { Trend, SideCard } from ".";
const trends = [
  {
    tag: "Trending",
    title: "#DalaiLama",
    count: 20600,
  },
  {
    tag: "Trending",
    title: "Texas",
    count: 6889,
  },
  {
    tag: "Business & finance • Trending",
    title: "Elon",
    count: 182000,
  },
  {
    tag: "Politics • Trending",
    title: "#BanAssaultWeaponsNow",
    count: 1744,
  },
  {
    tag: "Trending in Serbia",
    title: "Yugoslavia",
    count: 3400,
  },
  {
    tag: "Trending in Serbia",
    title: "Serbia",
    count: 4845,
  },
  {
    tag: "Trending",
    title: "Uber",
    count: 115000,
  },
  {
    tag: "Trending in Serbia",
    title: "Kosovo",
    count: 3201,
  },
  {
    tag: "Politics • Trending",
    title: "Ireland",
    count: 54200,
  },
  {
    tag: "Politics • Trending",
    title: "Ohio",
    count: 49000,
  },
];
</script>
