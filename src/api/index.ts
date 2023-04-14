import axios from "axios";
import { TRegisterBody, TLoginBody, TCreatePostBody } from "./types";
import store from "../store";

export const client = axios.create({
  baseURL: "http://localhost:3003",
});

const TwitterApi = {
  getFollowersByUserId: (userId: number) => {
    return client.get("/followers", {
      params: {
        userId,
      },
    });
  },
  like: (likeObject: { postId: number; userId: number }) => {
    return client.post("/likes", likeObject);
  },
  dislike: (likeId: number) => {
    return client.delete(`/likes/${likeId}`);
  },
  searchUsers: (q: string) => {
    return client.get("/users", { params: { q } });
  },
  editPost: (
    postId: number,
    postObject: { description?: string; image?: string }
  ) => {
    return client.patch(`/posts/${postId}`, postObject);
  },
  getSingleUser: (id: number) => {
    return client.get(`/users/${id}`, {
      params: {
        _embed: ["followers"],
      },
    });
  },
  getUsers: () => {
    return client.get("/users");
  },
  getPosts: () => {
    return client.get("/posts", {
      params: {
        _expand: "user",
        _embed: ["comments", "likes"],
        _sort: "createdAt",
        _order: "desc",
      },
    });
  },
  getSpecificPosts: (users: number[]) => {
    return client.get("/posts", {
      params: {
        _expand: "user",
        _embed: ["comments", "likes"],
        _sort: "createdAt",
        _order: "desc",
        userId: users,
      },
    });
  },
  getFollowers: (userId: number) => {
    return client.get("/followers", {
      params: {
        userId,
      },
    });
  },
  createFollow: (userId: number, followerId: number) => {
    return client.post("/followers", { userId, followerId });
  },
  deleteFollow: (id: number) => {
    return client.delete(`/followers/${id}`);
  },
  getUserPosts: (userId: number) => {
    return client.get("/posts", {
      params: {
        _expand: "user",
        _embed: ["comments", "likes"],
        _sort: "createdAt",
        _order: "desc",
        userId,
      },
    });
  },
  getComments: (postId: number) => {
    return client.get("/comments", {
      params: {
        postId,
        _expand: "user",
        _sort: "createdAt",
        _order: "desc",
      },
    });
  },
  editComment: (commentId: number, text: string) => {
    return client.patch(`/comments/${commentId}`, { text });
  },
  createComment: (userId: number, postId: number, text: string) => {
    const createdAt = new Date().toISOString();
    return client.post("/comments", { userId, postId, text, createdAt });
  },
  deleteComment: (commentId: number) => {
    return client.delete(`/comments/${commentId}`);
  },
  getPost: (postId: number) => {
    return client.get(`/posts/${postId}`, {
      params: {
        _embed: ["comments", "likes"],
      },
    });
  },
  deletePost: (postId: number) => {
    return client.delete(`/posts/${postId}`);
  },
  uploadPhoto: async (image: string) => {
    const userId = store.getters["getUserId"];
    return client.patch(`/users/${userId}`, {
      image,
    });
  },
  createPost: ({ description, image, userId }: TCreatePostBody) => {
    const createdAt = new Date().toISOString();
    return client.post("/posts", {
      userId,
      description,
      image,
      createdAt,
    });
  },
  login: ({ email, password }: TLoginBody) => {
    return client.post(
      "/login",
      { email, password },
      { withCredentials: true }
    );
  },
  register: ({ fullName, email, password, username }: TRegisterBody) => {
    return client.post("/register", {
      fullName,
      email,
      password,
      username,
      image: null,
    });
  },
};

export default TwitterApi;
