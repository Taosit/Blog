import {
  getCommentsForPost,
  postComment,
  removeComment,
  updateComment,
} from "@/lib/dbActions";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const commentsRouter = createTRPCRouter({
  getComments: publicProcedure.input(z.string()).query(async ({ input }) => {
    const comments = await getCommentsForPost(input);
    return comments;
  }),

  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, comment } = input;
      if (!comment) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const newComment = await postComment(
        ctx.currentUser.id,
        postId,
        JSON.parse(comment)
      );
      if (!newComment) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      return { ...newComment, createdAt: newComment.createdAt.toISOString() };
    }),

  updateComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { commentId, content } = input;
      const updatedComment = await updateComment(
        commentId,
        ctx.currentUser.id,
        JSON.parse(content)
      );
      return {
        ...updatedComment,
        createdAt: updatedComment.createdAt.toISOString(),
      };
    }),

  deleteComment: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await removeComment(input, ctx.currentUser.id);
      return input;
    }),
});
