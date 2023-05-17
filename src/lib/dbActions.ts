import { draftPostType, HslColorType, savedPostType } from "@/types/main";
import { Prisma } from "@prisma/client";
import { formatClass, getTerm } from "./helpers";
import prisma from "./prismadb";
import { JSONContent } from "@tiptap/react";

export const getUser = async (id: string) => {
  const user = await prisma.user.findUnique({
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
  const post = await prisma.post.findUnique({
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
      tags: true,
    },
  });
  if (!post) throw new Error("Post not found");
  return {
    ...post,
    tags: post.tags.map((tag) => tag.name),
    createdAt: post.createdAt.toISOString(),
    color: post.color ? (post.color as HslColorType) : undefined,
    image: post.image ? post.image : undefined,
    content: post.content ? (post.content as object) : undefined,
  };
};

export const updatePost = async (postId: string, post: savedPostType) => {
  const { class: className, content, tags, ...rest } = post;
  const corespondingClass = await getClassByName(className);
  if (!corespondingClass) throw new Error("Class not found");
  const userIsInClass = corespondingClass.users.some(
    (user) => user.id === post.authorId
  );
  if (!userIsInClass) throw new Error("User is not in class");
  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      classId: corespondingClass.id,
      content: JSON.parse(content),
      tags: {
        set: [],
        create: tags.map((tag) => ({ name: tag })),
      },
      ...rest,
    },
    include: {
      tags: true,
    },
  });
  return updatedPost;
};

export const removePost = async (postId: string) => {
  const postToDelete = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!postToDelete) return;
  const deleted = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return deleted;
};

export const getSavedPost = async (id: string) => {
  const post = await prisma.savedPost.findUnique({
    where: {
      userId: id,
    },
    include: {
      class: true,
      tags: true,
    },
  });
  if (!post) return null;
  return {
    ...post,
    coverType: post?.coverType as "COLOR" | "IMAGE",
    color: post?.color ? (post.color as HslColorType) : undefined,
    content: post?.content ? (post.content as object) : undefined,
    title: post?.title ? post.title : undefined,
    image: post?.image ? post.image : undefined,
  };
};

export const deleteSavedPost = async (id: string) => {
  const postToDelete = await prisma.savedPost.findUnique({
    where: {
      userId: id,
    },
  });
  if (!postToDelete) return;
  await prisma.savedPost.delete({
    where: {
      userId: id,
    },
  });
};

const getClassByName = async (name: string) => {
  return await prisma.class.findUnique({
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
  console.log("updateSavedPost");
  const { class: className, tags, ...rest } = post;
  let corespondingClass;
  if (className) {
    corespondingClass = await getClassByName(className);
    if (!corespondingClass) throw new Error("Class not found");
    const userIsInClass = corespondingClass.users.some(
      (user) => user.id === id
    );
    if (!userIsInClass) throw new Error("User is not in class");
  }
  const updatedPost = await prisma.savedPost.upsert({
    where: {
      userId: id,
    },
    create: {
      userId: id,
      content: rest.content as Prisma.JsonObject,
      tags: {
        create: tags.map((tag) => ({ name: tag })),
      },
      ...(corespondingClass && { classId: corespondingClass.id }),
      ...rest,
    },
    update: {
      ...(corespondingClass && { classId: corespondingClass.id }),
      tags: {
        set: [],
        create: tags.map((tag) => ({ name: tag })),
      },
      ...rest,
    },
    include: {
      tags: true,
    },
  });
  console.log(updatedPost.tags);
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
  const posts = await prisma.post.findMany({
    where: {
      AND: [
        {
          OR: [
            { author: { id: userId } },
            {
              title: {
                contains: search,
              },
            },
            {
              author: {
                firstName: {
                  contains: search,
                },
                lastName: {
                  contains: search,
                },
              },
            },
          ],
        },
        {
          class: {
            name: {
              contains: course,
            },
            term: {
              contains: term,
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
      tags: true,
    },
  });

  return posts.map((post) => ({
    ...post,
    tags: post.tags.map((tag) => tag.name),
    createdAt: post.createdAt.toISOString(),
  }));
};

type Post = {
  title: string;
  class: string;
  tags: string[];
  coverType: "COLOR" | "IMAGE";
  color?: HslColorType | undefined;
  image?: string | undefined;
  content: object;
};

export const postBlog = async (userId: string, post: Post) => {
  const { class: className, tags, ...rest } = post;
  const corespondingClass = await getClassByName(className);
  if (!corespondingClass) throw new Error("Class not found");
  const userIsInClass = corespondingClass.users.some(
    (user) => user.id === userId
  );
  if (!userIsInClass) throw new Error("User is not in class");
  const newPost = await prisma.post.create({
    data: {
      class: {
        connect: {
          id: corespondingClass.id,
        },
      },
      tags: {
        create: tags.map((tag) => ({
          name: tag,
        })),
      },
      author: {
        connect: {
          id: userId,
        },
      },
      ...rest,
    },
  });
  return newPost;
};

export const getCommentsForPost = async (postId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    include: {
      author: true,
    },
  });
  return comments.map((comment) => ({
    ...comment,
    content: comment.content as JSONContent,
    createdAt: comment.createdAt.toISOString(),
  }));
};

export const postComment = async (
  userId: string,
  postId: string,
  content: object
) => {
  const comment = await prisma.comment.create({
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
  return { ...comment, content: comment.content as JSONContent };
};

export const removeComment = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  if (!comment) throw new Error("Comment not found");
  if (comment.authorId !== userId) throw new Error("User is not author");
  await prisma.comment.delete({
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
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  if (!comment) throw new Error("Comment not found");
  if (comment.authorId !== userId)
    throw new Error("User is not the author of the comment");
  const updatedComment = await prisma.comment.update({
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
  return { ...updatedComment, content: updatedComment.content as JSONContent };
};

export const updateBasicUserInfo = async (
  userId: string,
  firstName: string,
  lastName: string,
  role?: "STUDENT" | "TEACHER",
  studentNumber?: string
) => {
  return await prisma.user.update({
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
  return await prisma.user.update({
    where: { id: userId },
    data: {
      color,
    },
  });
};

export const getUserClasses = async (userId: string) => {
  const user = await prisma.user.findUnique({
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
  const posts = await prisma.post.findMany({
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
      tags: true,
    },
  });

  return posts.map((post) => ({
    ...post,
    tags: post.tags.map((tag) => tag.name),
    createdAt: post.createdAt.toISOString(),
  }));
};

export const updateAvatar = async (userId: string, avatar: string) => {
  await prisma.user.update({
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
      const upsertedCourse = await prisma.class.upsert({
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

  return await prisma.user.update({
    where: { id: userId },
    data: {
      classes: { set: [], connect: newCourseIds },
    },
  });
};

export const getCoursesAndSemesters = async () => {
  const classes = await prisma.class.findMany({
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
    const classes = await prisma.class.findMany();
    return classes;
  }
  const { course, semester } = filter;
  const classes = await prisma.class.findMany({
    where: {
      ...(course && { name: course }),
      ...(semester && { term: semester }),
    },
  });
  return classes;
};
