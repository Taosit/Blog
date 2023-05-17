import { Class, Post, User } from "@prisma/client";

type accountFields = {
  isStudent: string;
  isProfessor: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  courses: string[];
};

type userUpdateFields = {
  firstName: string;
  lastName: string;
  role: "STUDENT" | "TEACHER";
  studentNumber: string | null;
  courses: string[];
  color?: HslColorType;
};

type UserFields = User & {
  classes?: Class[];
  posts?: Post[];
};

type coverType = "COLOR" | "IMAGE";

type savedPostType = {
  title: string;
  class: string;
  tags: string[];
  coverType: "COLOR" | "IMAGE";
  color?: HslColorType;
  image?: string;
  content: string;
  authorId: string;
};

type draftPostType = {
  title?: string;
  class?: string;
  tags: string[];
  coverType: "COLOR" | "IMAGE";
  color?: HslColorType;
  image?: string;
  content?: object;
};

type blogType = {
  id: string;
  title: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    color: HslColorType;
  };
  date: string;
  coverType: "COLOR" | "IMAGE";
  image: string;
  color: HslColorType;
};

type HslColorType = {
  h: number;
  s: number;
  l: number;
};
