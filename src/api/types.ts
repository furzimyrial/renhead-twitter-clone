export type TRegisterBody = {
  fullName: string;
  username: string;
  email: string;
  password: string;
};

export type TLoginBody = {
  email: string;
  password: string;
};

export type TCreatePostBody = {
  image: string;
  description: string;
  userId: number;
};
