import { createStore } from "vuex";
import TwitterApi, { client } from "../api";
import { TLoginPayload, TStore, TUser } from "../types";

const store = createStore<TStore>({
  state() {
    return {
      user: null,
      followers: [],
    };
  },
  mutations: {
    login: (state, payload) => {
      state.user = payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setPhoto: (state, payload) => {
      if (state.user) state.user.image = payload;
    },
    unfollow: (state, payload) => {
      state.followers = state.followers.filter(
        (follower) => follower.id !== payload
      );
    },
    follow: (state, payload) => {
      state.followers.push(payload);
    },
    setFollowers: (state, payload) => {
      state.followers = payload;
    },
  },
  actions: {
    follow: ({ commit }, payload) => {
      // Mutations
      commit("follow", payload);
    },
    unfollow: ({ commit }, payload) => {
      // Mutations
      commit("unfollow", payload);
    },
    setPhoto: ({ commit }, payload: string) => {
      // Mutations
      commit("setPhoto", payload);
    },
    login: async ({ commit }, payload: TLoginPayload) => {
      // Request for user and followers
      const { data: userData } = await TwitterApi.login(payload);
      const { data: followersData } = await TwitterApi.getFollowers(
        userData.id
      );

      // Combine user and token into same object
      const userObject = { ...userData.user, token: userData.accessToken };

      // Save email and password in local storage (There is no /me route in json-server-auth)
      localStorage.setItem("auth", JSON.stringify(payload));

      // Setting auth header in axios
      client.defaults.headers.common.Authorization = `Bearer ${userData.accessToken}`;

      // Mutations
      commit("login", userObject);
      commit("setFollowers", followersData);
    },
    logout: ({ commit }) => {
      // Remove from localstorage
      localStorage.removeItem("auth");

      // Removing auth header in axios
      client.defaults.headers.common.Authorization = null;

      // Mutations
      commit("logout");
    },
    me: async ({ dispatch }) => {
      // /me route workaround
      try {
        const json = localStorage.getItem("auth");
        if (json) {
          const data = JSON.parse(json);
          await dispatch("login", data);
          return true;
        }
      } catch {
        dispatch("logout");
        return false;
      }
    },
  },
  getters: {
    hasUser: (state) => !!state.user,
    getUser: (state) => state.user,
    getUserId: (state) => (state.user as TUser)?.id,
    getFollowers: (state) => state.followers,
  },
});

export default store;
