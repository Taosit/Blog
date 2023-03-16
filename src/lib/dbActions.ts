import { formatClass, getTerm } from "./helpers";
import client from "./prismadb";

export const updateBasicUserInfo = async (
  userId: string,
  name: string,
  role: "STUDENT" | "TEACHER",
  studentNumber: string | null
) => {
  await client.user.update({
    where: { id: userId },
    data: {
      name: name,
      role: role,
      studentNumber: studentNumber || null,
    },
  });
};

export const updateColor = async (
  userId: string,
  color: { h: number; s: number; l: number } | undefined
) => {
  if (!color) return;
  await client.color.upsert({
    where: { userId },
    update: {
      h: color.h,
      s: color.s,
      l: color.l || 80,
    },
    create: {
      h: color.h,
      s: color.s,
      l: color.l || 80,
      userId,
    },
  });
};

export const updateAvatar = async (userId: string, avatar: string) => {
  await client.user.update({
    where: { id: userId },
    data: {
      image: avatar,
    },
  });
};

export const updateStudentCourses = async (
  userId: string,
  newCourses: string[]
) => {
  const term = getTerm();
  const newCourseNames = newCourses.map((course) => formatClass(course));
  const newCourseIds = await Promise.all(
    newCourseNames.map(async (courseName) => {
      const upsertedCourse = await client.class.upsert({
        where: {
          courseIdentifier: {
            name: courseName,
            term,
          },
        },
        create: {
          name: courseName,
          term,
          users: { connect: { id: userId } },
        },
        update: {
          users: { connect: { id: userId } },
        },
        select: { id: true },
      });
      return { id: upsertedCourse.id };
    })
  );

  return await client.user.update({
    where: { id: userId },
    data: {
      classes: { set: [], connect: newCourseIds },
    },
  });
};
