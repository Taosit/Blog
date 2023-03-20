import { Class } from "@prisma/client";

export type accountFields = {
  isStudent: string;
  isProfessor: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  courses: string[];
};

export type userUpdateFields = {
  firstName: string;
  lastName: string;
  role: "STUDENT" | "TEACHER";
  studentNumber: string | null;
  courses: string[];
  color?: HslColorType;
};

export type userFields = {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  color?: HslColorType;
  classes?: any[];
  role: "STUDENT" | "TEACHER";
  studentNumber: null;
  posts?: any[];
};

export type coverType = "COLOR" | "IMAGE";

export type savedPostType = {
  title: string;
  class?: Class | null;
  tags: string[];
  coverType: "COLOR" | "IMAGE";
  color?: HslColorType;
  image?: string;
  content: object;
};

export type draftPostType = {
  class: string;
  tags: string[];
  coverType: "COLOR" | "IMAGE";
  color?: HslColorType;
  image?: string;
  content: object;
};

export type blogType = {
  id: string;
  title: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    color: string;
  };
  date: string;
  image: string;
  color: string;
};

export type HslColorType = {
  h: number;
  s: number;
  l: number;
};
