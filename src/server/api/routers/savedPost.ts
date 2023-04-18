import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  deleteSavedPost,
  getSavedPost,
  updateSavedPost,
} from "@/lib/dbActions";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const savedPostRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.userId !== ctx.currentUser.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const savedPost = await getSavedPost(input.userId);
      return savedPost;
    }),
  update: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        post: z
          .object({
            title: z.string().optional(),
            class: z.string().optional(),
            tags: z.array(z.string()).optional(),
            coverType: z.enum(["COLOR", "IMAGE"]),
            color: z
              .object({
                h: z.number(),
                s: z.number(),
                l: z.number(),
              })
              .optional(),
            image: z.string().optional(),
            content: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId !== ctx.currentUser.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const post = input.post;
      if (!post) {
        await deleteSavedPost(input.userId);
        return { savedPost: null };
      }
      if (post.image && !post.image.startsWith("http")) {
        const image = await uploadToCloudinary(post.image);
        post.image = image.secure_url;
      }
      console.log(post.content);
      const content = post.content ? JSON.parse(post.content) : undefined;
      const savedPost = await updateSavedPost(input.userId, {
        ...post,
        content,
      });
      return { savedPost };
    }),
});
