import { getAllPosts } from "@/lib/dbActions";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const testRouter = createTRPCRouter({
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
    .query(async ({ ctx, input }) => {
      const posts = await getAllPosts(input);
      return { posts };
    }),
});
