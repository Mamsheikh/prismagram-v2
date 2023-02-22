/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const MAX_FILE_SIZE = 1024 * 1024 * 5; //5MB

export const userRouter = createTRPCRouter({
  createUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { username } = input;
      const { prisma, session } = ctx;
      const { id: userId } = session.user;

      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username,
        },
      });
    }),

  user: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { userId } = input;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          following: true,

          _count: {
            select: {
              posts: true,
              followers: true,
              following: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found.",
        });
      }

      const isFollowing = !!user.following.find((user) => user.id === userId);

      return {
        ...user,
        isFollowing,
      };
    }),
});
