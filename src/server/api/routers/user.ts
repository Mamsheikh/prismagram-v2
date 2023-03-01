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
          followers: {
            select: {
              id: true,
            },
          },

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
  unfollow: protectedProcedure
    .input(z.object({ followId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { followId } = input;
      const { prisma, session } = ctx;
      const { id: userId } = session.user;

      const userToUnFollow = await prisma.user.findUnique({
        where: {
          id: followId,
        },
      });

      if (!userToUnFollow) {
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
            disconnect: {
              id: followId,
            },
          },
        },
      });
    }),
  followers: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { userId, cursor, limit } = input;
      const { id: sessionUserId } = session.user;
      const [user, following] = await Promise.all([
        prisma.user.findUnique({
          where: {
            id: userId,
          },
          include: {
            following: {
              select: {
                id: true,
              },
            },
            followers: {
              take: limit + 1,
              cursor: cursor ? { id: cursor } : undefined,
              where: {
                id: {
                  not: sessionUserId,
                },
              },
              select: {
                id: true,
                image: true,
                username: true,
                name: true,
              },
            },
          },
        }),
        prisma.user
          .findUnique({
            where: {
              id: sessionUserId,
            },
            select: {
              following: {
                select: {
                  id: true,
                },
              },
            },
          })
          .then((user) => user?.following?.map((f) => f.id) || []),
      ]);

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found.",
        });
      }

      console.log(user);
      // Add the `isFollowing` property to each follower object
      const followers = user.followers.map((follower) => ({
        ...follower,
        isFollowing: following.includes(follower.id),
      }));

      let nextCursor: string | undefined = undefined;

      if (followers.length > limit) {
        const lastFollower = followers[followers.length - 1];
        nextCursor = lastFollower?.id;
        followers.pop();
      }

      return {
        followers: followers,
        nextCursor,
      };
    }),

  // following: protectedProcedure
  //   .input(
  //     z.object({
  //       userId: z.string(),
  //       cursor: z.string().nullish(),
  //       limit: z.number().min(1).max(100).default(10),
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const { prisma, session } = ctx;
  //     const { userId, cursor, limit } = input;
  //     const { id: sessionUserId } = session.user;

  //     // Get the user's followers and following lists
  //     const [user, followers] = await Promise.all([
  //       prisma.user.findUnique({
  //         where: {
  //           id: userId,
  //         },
  //         include: {
  //           following: {
  //             take: limit + 1,
  //             cursor: cursor ? { id: cursor } : undefined,
  //             select: {
  //               id: true,
  //               image: true,
  //               username: true,
  //               name: true,
  //             },
  //           },
  //           followers: {
  //             where: {
  //               id: {
  //                 not: sessionUserId,
  //               },
  //             },
  //             select: {
  //               id: true,
  //             },
  //           },
  //         },
  //       }),
  //       prisma.user
  //         .findUnique({
  //           where: {
  //             id: sessionUserId,
  //           },
  //           select: {
  //             followers: {
  //               select: {
  //                 id: true,
  //               },
  //             },
  //           },
  //         })
  //         .then((user) => user?.followers?.map((f) => f.id) || []),
  //     ]);

  //     if (!user) {
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "Profile not found.",
  //       });
  //     }

  //     // Add the `isFollowed` property to each user object
  //     const following = user.following.map((user) => ({
  //       ...user,
  //       isFollowed: followers.includes(user.id),
  //     }));

  //     let nextCursor: typeof cursor | undefined = undefined;

  //     if (following.length > limit) {
  //       const nextItem = following.pop() as (typeof following)[number];

  //       nextCursor = nextItem.id;
  //     }

  //     // Return the modified following list
  //     return { following, nextCursor };

  //     // Return the modified following list
  //     return following;
  //   }),
});
