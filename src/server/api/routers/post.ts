/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { nanoid } from "nanoid";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { s3 } from "../../../lib/s3";

export const MAX_FILE_SIZE = 1024 * 1024 * 5; //5MB

export const postRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure
    .input(z.object({ fileType: z.string() }))
    .mutation(async ({ input }) => {
      const id = nanoid();
      const ex = input.fileType.split("/")[1] as string;
      const key = `${id}.${ex}`;

      const { url, fields } = (await new Promise((resolve, reject) => {
        s3.createPresignedPost(
          {
            Bucket: "prismagram-bucket",
            Fields: { key },
            Expires: 60,
            Conditions: [
              ["content-length-range", 0, MAX_FILE_SIZE],
              ["starts-with", "$Content-Type", "image/"],
            ],
          },
          (err, signed) => {
            if (err) return reject(err);
            resolve(signed);
          }
        );
      })) as any as { url: string; fields: any };

      return { url, fields, key };
    }),

  createPost: protectedProcedure
    .input(z.object({ caption: z.string(), imageKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx;
      const { imageKey, caption } = input;
      const { id: userId } = session.user;

      const post = await prisma.post.create({
        data: {
          caption,
          image: imageKey,
          user: {
            connect: {
              id: userId,
            },
          },
        },
        include: { user: true },
      });
      return post;
    }),

  posts: protectedProcedure
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

      const postsW = await prisma.post.findMany({
        take: limit + 1,
        // where,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }],
        include: {
          likes: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
          user: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (postsW.length > limit) {
        const nextItem = postsW.pop() as (typeof postsW)[number];

        nextCursor = nextItem.id;
      }

      // Each menu items only contains its AWS key. Extend all items with their actual img url
      const posts = await Promise.all(
        postsW.map(async (post) => {
          return {
            ...post,
            url: await s3.getSignedUrlPromise("getObject", {
              Bucket: "prismagram-bucket",
              Key: post.image,
            }),
          };
        })
      );

      return {
        posts,
        nextCursor,
      };
    }),

  like: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;
      const { session, prisma } = ctx;
      const { id: userId } = session.user;

      return await prisma.like.create({
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

  unlike: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx;
      const { postId } = input;
      const { id: userId } = session.user;

      return await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
    }),
});
