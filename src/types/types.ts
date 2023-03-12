export type accountFields = {
  isStudent: string;
  isProfessor: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  course: string;
};

export type userFields = {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  color?: string;
  classId: null;
  role: "STUDENT" | "Professor";
  studentNumber: null;
};
