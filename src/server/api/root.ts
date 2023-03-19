import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { postRouter } from "./routers/post";
import { commentRouter } from "./routers/comment";
import { favoriteRouter } from "./routers/favorite";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  comment: commentRouter,
  user: userRouter,
  post: postRouter,
  favorite: favoriteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
