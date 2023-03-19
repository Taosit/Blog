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
  color?: { h: number; s: number; l: number };
};

export type userFields = {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  color?: string;
  classes?: any[];
  role: "STUDENT" | "TEACHER";
  studentNumber: null;
  posts?: any[];
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
