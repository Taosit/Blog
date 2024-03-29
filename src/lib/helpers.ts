import { accountFields, HslColorType, userUpdateFields } from "@/types/main";

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
    role: (data.isStudent === "Yes" ? "STUDENT" : "TEACHER") as Role,
    studentNumber: data.studentNumber,
    courses: data.courses,
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

export const getTerm = (date = new Date()) => {
  const term = date.getMonth() < 4 ? "W2" : date.getMonth() < 8 ? "W1" : "S";
  const year = term === "W2" ? date.getFullYear() - 1 : date.getFullYear();
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

export const formatDate = (date: Date | string) => {
  const dateObj = new Date(date);
  const dateFormatter = new Intl.DateTimeFormat("en-US");
  return dateFormatter.format(dateObj);
};

export async function cropImage(
  imageUrl: string,
  targetWidth: number = 500
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
  const scale = targetWidth / img.width;
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
}

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

export async function cropImageRectangle(
  imageUrl: string,
  width: number = 1000,
  height: number = 200
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
  const aspectRatio = width / height;
  const imgAspectRatio = img.width / img.height;
  let x, y, w, h;
  if (imgAspectRatio > aspectRatio) {
    h = img.height;
    w = h * aspectRatio;
    x = (img.width - w) / 2;
    y = 0;
  } else {
    w = img.width;
    h = w / aspectRatio;
    x = 0;
    y = (img.height - h) / 2;
  }
  canvas.width = width;
  canvas.height = height;
  ctx!.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
}

const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

const DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
] as const;

export function formatTimeAgo(date: Date) {
  let duration = (date.getTime() - new Date().getTime()) / 1000;

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
}
