import { savedPostType } from "@/types/types";
import { formatClass, getTerm } from "./helpers";
import client from "./prismadb";

export const getUser = async (id: string) => {
  const user = await client.user.findUnique({
    where: {
      id,
    },
    include: {
      classes: true,
    },
  });
  return user;
};

export const getSavedPost = async (id: string) => {
  const post = await client.savedPost.findUnique({
    where: {
      userId: id,
    },
    include: {
      class: true,
    },
  });
  return post;
};

export const updateSavedPost = async (id: string, post: savedPostType) => {
  const { class: classInfo, ...rest } = post;
  const updatedPost = await client.savedPost.upsert({
    where: {
      userId: id,
    },
    create: {
      userId: id,
      classId: classInfo?.id || undefined,
      ...rest,
    },
    update: { ...rest },
  });
  return updatedPost;
};

export const updateBasicUserInfo = async (
  userId: string,
  name: string,
  role: "STUDENT" | "TEACHER",
  studentNumber: string | null,
  color: { h: number; s: number; l: number } | undefined
) => {
  return await client.user.update({
    where: { id: userId },
    data: {
      name,
      role,
      studentNumber,
      color,
    },
  });
};

export const updateUserColor = async (
  userId: string,
  color: { h: number; s: number; l: number } | undefined
) => {
  return await client.user.update({
    where: { id: userId },
    data: {
      color,
    },
  });
};

export const getUserClasses = async (userId: string) => {
  const user = await client.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      classes: true,
    },
  });
  return user?.classes;
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
