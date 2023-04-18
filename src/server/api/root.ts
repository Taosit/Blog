import { postsRouter } from "./routers/posts";
import { savedPostRouter } from "./routers/savedPost";
import { testRouter } from "./routers/test";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  test: testRouter,
  posts: postsRouter,
  savedPost: savedPostRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
