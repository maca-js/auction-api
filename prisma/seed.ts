import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'test@test.com',
    name: 'User 1',
    password: '123456',
  },
  {
    email: 'test2@test.com',
    name: 'User 2',
    password: '123456',
  },
];

const CATEGORY_ID = '2efc6d85-cc82-4433-9c95-c9d7dabc7103';
const categoryData: Prisma.CategoryCreateInput = {
  id: CATEGORY_ID,
  title: 'Test category',
};

async function main() {
  await prisma.category.create({
    data: categoryData,
  });

  for (const user of userData) {
    await prisma.user.create({
      data: {
        ...user,
        posts: {
          create: [
            {
              title: `Test post from ${user.email}`,
              description: `Test post from ${user.email}`,
              mainImgUrl: 'path to image here',
              startPrice: 100,
              currentPrice: 100,
              categoryId: CATEGORY_ID,
              step: 100,
              status: 'active',
              winnerId: '',
            },
          ],
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
