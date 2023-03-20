import { accountFields, HslColorType, userUpdateFields } from "@/types/types";

export const getEmailError = (str: string) => {
  const regex =
    /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

  if (str.length === 0) {
    return "Email must be filled.";
  } else if (!regex.test(str)) {
    return "Invalid email.";
  } else {
    return "";
  }
};

export const getStudentNumberError = (str: string) => {
  const regex = /^\d{8}$/;

  if (str.length === 0) {
    return "Student number must be filled.";
  } else if (!regex.test(str)) {
    return "Invalid student number.";
  } else {
    return "";
  }
};

export const getNameError = (str: string, type: string) => {
  const regex = /[a-zA-Z]{2,}/;
  const lowerCaseType = type.toLowerCase();

  if (str.length === 0) {
    return `${lowerCaseType.replace(
      type[0],
      type[0].toUpperCase()
    )} name must be filled.`;
  } else if (!regex.test(str)) {
    return `Invalid ${lowerCaseType} name.`;
  } else {
    return "";
  }
};

export const isCourseValid = (str: string) => {
  const regex = /^[a-zA-Z]{4}\s?[1-7]\d{2}$/;
  if (str.length === 0) {
    return false;
  }
  if (!regex.test(str)) {
    return false;
  }
  return true;
};

export const getCoursesError = (courses: string[]) => {
  if (courses.length === 0) {
    return "Courses must be filled.";
  }
  return "";
};

export const isFormInvalid = (form: accountFields) => {
  const {
    isStudent,
    isProfessor,
    studentNumber,
    firstName,
    lastName,
    courses,
  } = form;

  return (
    isStudent === "" ||
    (isStudent === "No" && isProfessor === "") ||
    (isStudent === "Yes" && getStudentNumberError(studentNumber)) ||
    getNameError(firstName, "first") ||
    getNameError(lastName, "last") ||
    getCoursesError(courses)
  );
};

type Role = "STUDENT" | "TEACHER";

export const formatAccountFormData = (data: accountFields) => {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    role: (data.isStudent ? "STUDENT" : "TEACHER") as Role,
    studentNumber: data.studentNumber,
    courses: data.courses,
    color: { h: Math.floor(Math.random() * 360), s: 100, l: 80 },
  };
};

export const isUserUpdateSubmissionInvalid = (data: userUpdateFields) => {
  const { role, studentNumber, firstName, lastName, courses } = data;
  return (
    (role === "STUDENT" &&
      (!studentNumber || getStudentNumberError(studentNumber))) ||
    getNameError(firstName, "first") ||
    getNameError(lastName, "last") ||
    getCoursesError(courses)
  );
};

export const getTerm = () => {
  const today = new Date();
  const term = today.getMonth() < 4 ? "W2" : today.getMonth() < 8 ? "W1" : "S";
  const year = term === "W2" ? today.getFullYear() - 1 : today.getFullYear();
  return `${year}${term}`;
};

export const formatClass = (name: string) => {
  const trimedName = name.trim().toLowerCase();
  if (!trimedName.includes(" ")) return trimedName;
  return trimedName.split(" ").join("");
};

export const toColorString = (color: HslColorType) => {
  const { h, s, l } = color;
  return `hsl(${h} ${s}% ${l}%)`;
};

export const darkenColor = (color: HslColorType) => {
  return { ...color, l: Math.max(20, color.l - 50) };
};

export async function cropImageSquare(
  imageUrl: string,
  size: number = 300
): Promise<string> {
  const img = new Image();
  img.src = imageUrl;
  await new Promise((resolve) => {
    img.onload = () => {
      resolve(null);
    };
  });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const scale = Math.max(size / img.width, size / img.height);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");
  croppedCanvas.width = size;
  croppedCanvas.height = size;
  const x = (canvas.width - size) / 2;
  const y = (canvas.height - size) / 2;
  croppedCtx!.drawImage(canvas, x, y, size, size, 0, 0, size, size);
  return croppedCanvas.toDataURL();
}

export async function cropImageRectangle(imageUrl: string): Promise<string> {
  const img = new Image();
  img.src = imageUrl;
  await new Promise((resolve) => {
    img.onload = () => {
      resolve(null);
    };
  });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const scale = Math.min(1000 / img.width, 200 / img.height);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");
  croppedCanvas.width = 1000;
  croppedCanvas.height = 200;
  const x = (canvas.width - 1000) / 2;
  const y = (canvas.height - 200) / 2;
  croppedCtx!.drawImage(canvas, x, y, 1000, 200, 0, 0, 1000, 200);
  return croppedCanvas.toDataURL();
}
