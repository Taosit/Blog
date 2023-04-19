import { commentsRouter } from "./routers/comments";
import { postsRouter } from "./routers/posts";
import { imageRouter } from "./routers/image";
import { savedPostRouter } from "./routers/savedPost";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  posts: postsRouter,
  savedPost: savedPostRouter,
  comments: commentsRouter,
  image: imageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
