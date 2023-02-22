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
      const { prisma, session } = ctx;
      const { userId } = input;
      const { id: sessionUserId } = session.user;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          followers: true,

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

      const isFollowing = !!user.followers.find(
        (user) => user.id === sessionUserId
      );

      return {
        ...user,
        isFollowing,
      };
    }),
  follow: protectedProcedure
    .input(z.object({ followId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { followId } = input;
      const { prisma, session } = ctx;
      const { id: userId } = session.user;

      const userToFollow = await prisma.user.findUnique({
        where: {
          id: followId,
        },
      });

      if (!userToFollow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          following: {
            connect: {
              id: followId,
            },
          },
        },
      });
    }),
});
