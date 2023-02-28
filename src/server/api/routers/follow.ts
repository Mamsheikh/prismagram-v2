/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const followRouter = createTRPCRouter({
  follow: protectedProcedure
    .input(z.object({ followId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { followId } = input;
      const { prisma, session } = ctx;
      const { id: userId } = session.user;

      const follow = await prisma.follow.findFirst({
        where: {
          followedId: followId,
          followerId: userId,
        },
      });

      if (!follow) {
        return await ctx.prisma.follow.create({
          data: {
            followedId: followId,
            followerId: userId,
          },
        });
      }

      return follow;
    }),
  unfollow: protectedProcedure
    .input(z.object({ followedId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { followedId } = input;
      const { prisma, session } = ctx;
      const { id: userId } = session.user;

      const follow = await prisma.follow.findFirst({
        where: {
          followedId: followedId,
          followerId: userId,
        },
      });

      if (follow) {
        return await ctx.prisma.follow.delete({
          where: {
            followedId_followerId: {
              followedId,
              followerId: userId,
            },
          },
        });
      }

      return follow;
    }),

  comments: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, postId } = input;
      const { prisma } = ctx;

      const comments = await prisma.comment.findMany({
        take: limit + 1,
        where: {
          postId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (comments.length > limit) {
        const nextItem = comments.pop() as (typeof comments)[number];

        nextCursor = nextItem.id;
      }

      return {
        comments,
        nextCursor,
      };
    }),
});
