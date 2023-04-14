export type TUser = {
  id: number;
  fullName: string;
  username: string;
  image: string;
  email: string;
  followers: number[];
  followings: number[];
};

export type TFollower = {
  id: number;
  userId: number;
  followerId: number;
};

export type TStore = {
  user: TUser | null;
  followers: TFollower[];
};

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TEmitterEvents = {
  [eventName: string]: any;
};

export type TComment = {
  id: number;
  userId: number;
  postId: number;
  text: string;
  createdAt: string;
  user: TUser;
};

export type TLike = {
  id: number;
  userId: number;
  postId: number;
};

export type TPost = {
  id: number;
  userId: number;
  comments: TComment[];
  createdAt: string;
  description: string;
  image: string;
  likes: TLike[];
  user: TUser;
};

export type TNewPost = {
  image: string;
  description: string;
};

export type TMenuItem = {
  label: string;
  action: (closeFn: () => void) => void;
};
