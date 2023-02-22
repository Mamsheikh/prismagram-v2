/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

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

  user: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    const { id: userId } = session.user;

    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });
  }),
});
