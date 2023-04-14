<template>
  <Input
    label="Full Name"
    placeholder="Enter your full name here"
    :validators="nameValidators"
    v-model="state.fullName"
    type="text"
    required
  />
  <Input
    label="Username"
    placeholder="Enter your username here"
    :validators="nameValidators"
    v-model="state.username"
    type="text"
    required
  />
  <Input
    label="Email"
    placeholder="Enter your email here"
    :validators="emailValidators"
    v-model="state.email"
    type="email"
    required
  />
  <Input
    label="Password"
    placeholder="Enter your password here"
    :validators="passwordValidators"
    v-model="state.password"
    type="password"
    required
  />
  <Button class="w-full mt-5" @click="handleRegister">Register</Button>
  <div class="text-xs text-gray-400 mt-5 text-center">
    Already have an account?
    <RouterLink class="text-twitter-blue" to="/login">Login</RouterLink>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { Button, Input } from "../components/ui";
import { RouterLink, useRouter } from "vue-router";
import {
  emailValidators,
  nameValidators,
  passwordValidators,
} from "../utils/validators";
import TwitterApi from "../api";

const router = useRouter();
const state = reactive({
  fullName: "",
  username: "",
  email: "",
  password: "",
});

const handleRegister = async () => {
  await TwitterApi.register(state);
  router.push("/login");
};
</script>
