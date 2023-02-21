import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Create 50 users
  const users = [];
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        image: `https://picsum.photos/seed/${i}/200/200`,
      },
    });
    users.push(user);
  }

  // Create 100 posts (2 per user)
  const posts = [];
  for (let i = 0; i < 50; i++) {
    const user = users[i];
    const post1 = await prisma.post.create({
      data: {
        caption: faker.lorem.sentence(),
        image: `https://picsum.photos/seed/post-${i}-1/600/400`,
        user: {
          connect: { id: user?.id },
        },
      },
    });
    const post2 = await prisma.post.create({
      data: {
        caption: faker.lorem.sentence(),
        image: `https://picsum.photos/seed/post-${i}-2/600/400`,
        user: {
          connect: { id: user?.id },
        },
      },
    });
    posts.push(post1, post2);
  }

  // Create 50 likes (1 per user)
  for (let i = 0; i < 50; i++) {
    const user = users[i];
    const post = posts[i];
    await prisma.like.create({
      data: {
        post: {
          connect: { id: post?.id },
        },
        user: {
          connect: { id: user?.id },
        },
      },
    });
  }

  // Create 50 comments (1 per user)
  for (let i = 0; i < 50; i++) {
    const user = users[i];
    const post = posts[i];
    await prisma.comment.create({
      data: {
        content: faker.lorem.sentence(),
        post: {
          connect: { id: post?.id },
        },
        user: {
          connect: { id: user?.id },
        },
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
