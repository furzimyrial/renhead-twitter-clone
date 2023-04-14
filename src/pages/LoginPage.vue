<template>
  <Input
    label="Email"
    :validators="emailValidators"
    placeholder="Enter your email here"
    v-model="state.email"
    type="text"
    required
    :disabled="formDisabled"
  />
  <Input
    label="Password"
    :validators="passwordValidators"
    placeholder="Enter your password here"
    v-model="state.password"
    type="password"
    required
    :disabled="formDisabled"
  />
  <Button class="w-full mt-5" @click="handleLogin" :disabled="formDisabled"
    >Log In</Button
  >
  <div class="text-xs text-gray-400 mt-5 text-center">
    Don't have an account?
    <RouterLink class="text-twitter-blue" to="/register">Register</RouterLink>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { Button, Input } from "../components/ui";
import { emailValidators, passwordValidators } from "../utils/validators";
import { AxiosError } from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const formDisabled = ref(false);
const store = useStore();
const router = useRouter();
const state = reactive({
  email: "",
  password: "",
});

const handleLogin = async () => {
  try {
    formDisabled.value = true;
    await store.dispatch("login", state);
    router.push("/");
  } catch (e) {
    if (e instanceof AxiosError) {
      alert(e.response?.data);
    } else {
      alert(e);
    }
  } finally {
    formDisabled.value = false;
  }
};
</script>
