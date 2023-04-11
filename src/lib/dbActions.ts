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
  if (!user) throw new Error("User not found");
  return user;
};

export const getPost = async (id: string) => {
  const post = await client.post.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          firstName: true,
          image: true,
          color: true,
        },
      },
      comments: true,
      class: {
        select: {
          name: true,
        },
      },
    },
  });
  if (!post) throw new Error("Post not found");
  return { ...post, createdAt: post.createdAt.toISOString() };
};

export const updatePost = async (
  postId: string,
  userId: string,
  post: savedPostType
) => {
  const { class: className, ...rest } = post;
  const corespondingClass = await getClassByName(className);
  if (!corespondingClass) throw new Error("Class not found");
  const userIsInClass = corespondingClass.users.some(
    (user) => user.id === userId
  );
  if (!userIsInClass) throw new Error("User is not in class");
  const updatedPost = await client.post.update({
    where: {
      id: postId,
    },
    data: {
      classId: corespondingClass.id,
      ...rest,
    },
  });
  return updatedPost;
};

export const removePost = async (postId: string, userId: string) => {
  const postToDelete = await client.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!postToDelete) return;
  if (postToDelete.authorId !== userId) throw new Error("User is not author");
  const deleted = await client.post.delete({
    where: {
      id: postId,
    },
  });
  return deleted;
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

const getClassByName = async (name: string) => {
  return await client.class.findUnique({
    where: {
      courseIdentifier: {
        name: name.toLowerCase(),
        term: getTerm(),
      },
    },
    select: {
      id: true,
      name: true,
      users: { select: { id: true } },
    },
  });
};

export const updateSavedPost = async (id: string, post: draftPostType) => {
  const { class: className, ...rest } = post;
  const corespondingClass = await getClassByName(className);
  if (!corespondingClass) throw new Error("Class not found");
  const userIsInClass = corespondingClass.users.some((user) => user.id === id);
  if (!userIsInClass) throw new Error("User is not in class");
  const updatedPost = await client.savedPost.upsert({
    where: {
      userId: id,
    },
    create: {
      userId: id,
      content: rest.content as Prisma.InputJsonValue,
      classId: corespondingClass.id,
      ...rest,
    },
    update: { classId: corespondingClass.id, ...rest },
  });
  return updatedPost;
};

type SearchFilters = {
  search?: string;
  course?: string;
  term?: string;
  sort?: string;
  userId?: string;
};

export const getAllPosts = async ({
  search = "",
  course = "all courses",
  term = "all terms",
  sort = "",
  userId = "",
}: SearchFilters) => {
  course = course === "all courses" ? "" : course;
  term = term === "all terms" ? "" : term;
  const sortValues: { [key: string]: string | object } = {};
  if (sort === "new") {
    sortValues["createdAt"] = "desc";
  }
  if (sort === "popular") {
    sortValues["comments"] = {
      _count: "desc",
    };
  }
  const posts = await client.post.findMany({
    where: {
      AND: [
        {
          OR: [
            { author: { id: userId } },
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              author: {
                firstName: {
                  contains: search,
                  mode: "insensitive",
                },
                lastName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        {
          class: {
            name: {
              contains: course,
              mode: "insensitive",
            },
            term: {
              contains: term,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    orderBy: sortValues,
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          image: true,
          color: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
  }));
};

export const postBlog = async (userId: string, post: savedPostType) => {
  const { class: className, authorId, ...rest } = post;
  const corespondingClass = await getClassByName(className);
  if (!corespondingClass) throw new Error("Class not found");
  const userIsInClass = corespondingClass.users.some(
    (user) => user.id === userId
  );
  if (!userIsInClass) throw new Error("User is not in class");
  const newPost = await client.post.create({
    data: {
      class: {
        connect: {
          id: corespondingClass.id,
        },
      },
      author: {
        connect: {
          id: userId,
        },
      },
      content: rest.content as Prisma.JsonObject,
      ...rest,
    },
  });
  return newPost;
};

export const getCommentsForPost = async (postId: string) => {
  const comments = await client.comment.findMany({
    where: {
      postId,
    },
    include: {
      author: true,
    },
  });
  return comments.map((comment) => ({
    ...comment,
    createdAt: comment.createdAt.toISOString(),
  }));
};

export const postComment = async (
  userId: string,
  postId: string,
  content: object
) => {
  const comment = await client.comment.create({
    data: {
      content: content as Prisma.JsonObject,
      author: {
        connect: {
          id: userId,
        },
      },
      post: {
        connect: {
          id: postId,
        },
      },
    },
    include: {
      author: true,
    },
  });
  return comment;
};

export const removeComment = async (commentId: string, userId: string) => {
  const comment = await client.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  if (!comment) throw new Error("Comment not found");
  if (comment.authorId !== userId) throw new Error("User is not author");
  await client.comment.delete({
    where: {
      id: commentId,
    },
  });
};

export const updateComment = async (
  commentId: string,
  userId: string,
  content: object
) => {
  const comment = await client.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  if (!comment) throw new Error("Comment not found");
  if (comment.authorId !== userId) throw new Error("User is not author");
  const updatedComment = await client.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: content as Prisma.JsonObject,
    },
    include: {
      author: true,
    },
  });
  return updatedComment;
};

export const updateBasicUserInfo = async (
  userId: string,
  firstName: string,
  lastName: string,
  role?: "STUDENT" | "TEACHER",
  studentNumber?: string
) => {
  return await client.user.update({
    where: { id: userId },
    data: {
      firstName,
      lastName,
      ...(role && { role }),
      ...(studentNumber && { studentNumber }),
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

export const getUserPosts = async (userId: string) => {
  const posts = await client.post.findMany({
    where: {
      authorId: userId,
    },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          image: true,
          color: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
  }));
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

type classFilter = {
  course?: string;
  semester?: string;
} | null;

export const getClasses = async (filter: classFilter) => {
  if (!filter || (!filter.course && !filter.semester)) {
    const classes = await client.class.findMany();
    return classes;
  }
  const { course, semester } = filter;
  const classes = await client.class.findMany({
    where: {
      ...(course && { name: course }),
      ...(semester && { term: semester }),
    },
  });
  return classes;
};
