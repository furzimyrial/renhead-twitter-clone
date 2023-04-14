import { createApp } from "vue";
import mitt from "mitt";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./style.css";

const emitter = mitt();

const app = createApp(App);

app.use(router);

app.use(store);

app.provide("emitter", emitter);

app.mount("#app");

