import { draftPostType, savedPostType } from "@/types/types";
import { Prisma } from "@prisma/client";
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

export const deleteSavedPost = async (id: string) => {
  const postToDelete = await client.savedPost.findUnique({
    where: {
      userId: id,
    },
  });
  if (!postToDelete) return;
  await client.savedPost.delete({
    where: {
      userId: id,
    },
  });
};

export const updateSavedPost = async (id: string, post: draftPostType) => {
  const { class: className, ...rest } = post;
  const corespondingClass = await client.class.findUnique({
    where: {
      courseIdentifier: {
        name: className.toLowerCase(),
        term: getTerm(),
      },
    },
    select: {
      id: true,
      name: true,
      users: { select: { id: true } },
    },
  });
  if (!corespondingClass) throw new Error("Class not found");
  const userIsInClass = corespondingClass.users.some((user) => user.id === id);
  if (!userIsInClass) throw new Error("User is not in class");
  const updatedPost = await client.savedPost.upsert({
    where: {
      userId: id,
    },
    create: {
      userId: id,
      classId: corespondingClass.id,
      ...rest,
    },
    update: { classId: corespondingClass.id, ...rest },
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
      color: color as Prisma.JsonObject,
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

export const getCoursesAndSemesters = async () => {
  const classes = await client.class.findMany({
    select: {
      name: true,
      term: true,
    },
  });
  const courses = [...new Set(classes.map((course) => course.name))];
  const semesters = [...new Set(classes.map((course) => course.term))];
  return { courses, semesters };
};
