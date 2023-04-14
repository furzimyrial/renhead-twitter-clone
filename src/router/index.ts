import { createRouter, createWebHistory } from "vue-router";
import { LoggedInLayout, LoggedOutLayout } from "../layouts";
import {
  HomePage,
  LoginPage,
  ProfilePage,
  RegisterPage,
  UserPage,
  EmptyPage,
  PostPage,
} from "../pages";
import store from "../store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { layout: LoggedInLayout, title: "Home" },
  },
  {
    path: "/explore",
    name: "Explore",
    component: EmptyPage,
    meta: { layout: LoggedInLayout, title: "Explore" },
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: EmptyPage,
    meta: { layout: LoggedInLayout, title: "Notifications" },
  },
  {
    path: "/messages",
    name: "Messages",
    component: EmptyPage,
    meta: { layout: LoggedInLayout, title: "Messages" },
  },
  {
    path: "/bookmarks",
    name: "Bookmarks",
    component: EmptyPage,
    meta: { layout: LoggedInLayout, title: "Bookmarks" },
  },
  {
    path: "/twitter-blue",
    name: "Twitter Blue",
    component: EmptyPage,
    meta: { layout: LoggedInLayout, title: "Twitter Blue" },
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
    meta: { layout: LoggedInLayout, title: "Profile" },
  },
  {
    path: "/more",
    name: "More",
    component: EmptyPage,
    meta: { layout: LoggedInLayout, title: "More" },
  },
  {
    path: "/user/:id",
    name: "User",
    component: UserPage,
    meta: { layout: LoggedInLayout, title: "User" },
  },
  {
    path: "/user/:id/post/:postId",
    name: "Post",
    component: PostPage,
    meta: { layout: LoggedInLayout, title: "Post" },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { layout: LoggedOutLayout, title: "Login" },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    meta: { layout: LoggedOutLayout, title: "Register" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const isLoggedIn = store.getters["hasUser"] || (await store.dispatch("me"));
  if (to.meta.layout !== LoggedInLayout && isLoggedIn) {
    next("/");
  } else if (to.meta.layout !== LoggedOutLayout && !isLoggedIn) {
    next("/login");
  } else {
    document.title = `${to.meta.title || "Welcome"} | Twitter`;
    next();
  }
});

export default router;
