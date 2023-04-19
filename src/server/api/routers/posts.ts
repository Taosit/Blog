import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  deleteSavedPost,
  getAllPosts,
  getPost,
  postBlog,
  removePost,
  updatePost,
} from "@/lib/dbActions";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const postsRouter = createTRPCRouter({
  getPosts: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        search: z.string().optional(),
        course: z.string().optional(),
        term: z.string().optional(),
        sort: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const posts = await getAllPosts(input);
      return { posts };
    }),

  getPost: publicProcedure.input(z.string()).query(async ({ input }) => {
    const post = await getPost(input);
    return post;
  }),

  createPost: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        post: z.object({
          title: z.string(),
          class: z.string(),
          tags: z.array(z.string()),
          coverType: z.enum(["COLOR", "IMAGE"]),
          color: z
            .object({
              h: z.number(),
              s: z.number(),
              l: z.number(),
            })
            .optional(),
          image: z.string().optional(),
          content: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, post } = input;
      if (userId !== ctx.currentUser.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      if (!post) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      if (post.image && !post.image.startsWith("http")) {
        const image = await uploadToCloudinary(post.image);
        post.image = image.secure_url;
      }
      postBlog(userId, { ...post, content: JSON.parse(post.content) })
        .then((newPost) => {
          deleteSavedPost(userId);
          return { newPost };
        })
        .catch((err) => {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        });
    }),

  updatePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        post: z.object({
          authorId: z.string(),
          title: z.string(),
          class: z.string(),
          tags: z.array(z.string()),
          coverType: z.enum(["COLOR", "IMAGE"]),
          color: z
            .object({
              h: z.number(),
              s: z.number(),
              l: z.number(),
            })
            .optional(),
          image: z.string().optional(),
          content: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, post } = input;
      if (post.authorId !== ctx.currentUser.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      if (!post) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const updatedPost = await updatePost(postId, post);
      return updatedPost;
    }),

  deletePost: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await getPost(input);
      if (post.authorId !== ctx.currentUser.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      await removePost(input);
      return input;
    }),
});
