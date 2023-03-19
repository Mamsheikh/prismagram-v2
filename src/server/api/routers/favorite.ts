import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

import { s3 } from "../../../lib/s3";

export const favoriteRouter = createTRPCRouter({
  favorites: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id: userId } = session.user;
      const { cursor, limit } = input;

      const postsW = await prisma.favorite.findMany({
        take: limit + 1,
        where: {
          user: {
            id: userId,
          },
        },
        include: {
          post: {
            select: {
              id: true,
              image: true,
              _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },
            },
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }],
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (postsW.length > limit) {
        const nextItem = postsW.pop() as (typeof postsW)[number];

        nextCursor = nextItem.id;
      }

      //   const favorites = await Promise.all(
      //     postsW.map(async (favorite) => {
      //       return {
      //         ...favorite,
      //         url: await s3.getSignedUrlPromise("getObject", {
      //           Bucket: "prismagram-bucket",
      //           Key: favorite.post.image,
      //         }),
      //       };
      //     })
      //   );
      const favorites = await Promise.all(
        postsW.map(async (favorite) => {
          let imageUrl = favorite.post.image;
          if (!imageUrl.startsWith("http")) {
            imageUrl = await s3.getSignedUrlPromise("getObject", {
              Bucket: "prismagram-bucket",
              Key: favorite.post.image,
            });
          }
          return {
            ...favorite,
            url: imageUrl,
          };
        })
      );

      return {
        favorites,
        nextCursor,
      };
    }),

  post: protectedProcedure
    .input(z.object({ postId: z.string() }))
    // .output(z.i)
    .query(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { id: userId } = session.user;
      const { postId } = input;

      const postData = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
          likes: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      if (!postData) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // const url = await s3.getSignedUrlPromise("getObject", {
      //   Bucket: "prismagram-bucket",
      //   Key: postData.image,
      //   // Expires: 60 // the URL will be valid for 60 seconds
      // });
      let url = postData.image;
      if (!url.startsWith("http")) {
        url = await s3.getSignedUrlPromise("getObject", {
          Bucket: "prismagram-bucket",
          Key: postData.image,
        });
      }

      const post = { ...postData, url };
      return post;
    }),

  favorite: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;
      const { session, prisma } = ctx;
      const { id: userId } = session.user;

      return await prisma.favorite.create({
        data: {
          post: {
            connect: {
              id: postId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),

  unfavorite: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx;
      const { postId } = input;
      const { id: userId } = session.user;

      return await prisma.favorite.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
    }),
});
