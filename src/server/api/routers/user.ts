/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { nanoid } from "nanoid";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { s3 } from "../../../lib/s3";

const MAX_SIZE = 1024 * 1024 * 5; //5MB

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

  createPresignedUrl: protectedProcedure
    .input(z.object({ fileType: z.string() }))
    .mutation(({ input }) => {
      const id = nanoid();
      const ex = input.fileType.split("/")[1] as string;
      const key = `${id}.${ex}`;

      const { url, fields } = new Promise((resolve, reject) => {
        s3.createPresignedPost(
          {
            Bucket: "prismagram-bucket",
            Fields: { key },
            Expires: 60,
            Conditions: [
              ["content-length-range", 0, MAX_SIZE],
              ["starts-with", "$Content-Type", "image/"],
            ],
          },

          (err, data) => {
            if (err) return reject(err);
            resolve(data);
          }
        );
      }) as any as { url: string; fields: any };

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
      });
      return post;
    }),
});
