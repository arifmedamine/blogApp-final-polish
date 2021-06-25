import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

async function main() {
  dotenv.config();
  console.log('Seeding...');

  const user1 = await prisma.user.create({
    data: {
      email: 'aaaarrifmedamine@esprit.com',
      firstname: 'Arif',
      lastname: 'Amine',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      role: 'USER',
      posts: {
        create: {
          title: 'Join us for Prisma Day 2021 in Tunisia',
          content: 'https://www.prisma.io/day/',
          published: true,
        },
      },
      issues: {
        create: {
          title: 'some issues',
          description: 'some issues description',
          published: true,
        },
      },
      aricles: {
        create: {
          title: 'some article',
          description: 'some article description',
          published: true,
        },
      },
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: 'nnnnizarr@esprit.com',
      firstname: 'Mejri',
      lastname: 'Nijar',
      role: 'ADMIN',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      posts: {
        create: [
          {
            title: 'Subscribe to GraphQL Weekly for community news',
            content: 'https://graphqlweekly.com/',
            published: true,
          },
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma',
            published: false,
          },
        ],
      },
      issues: {
        create: [{
          title: 'some issues',
          description: 'some issues description',
          published: true,
        },
        {
          title: 'some other issues',
          description: 'some other issues description',
          published: true,
        },
        {
          title: 'some other other issues',
          description: 'some other other issues description',
          published: true,
        },
      ]
      },
      aricles: {
        create: {
          title: 'some article',
          description: 'some article description',
          published: true,
        },
      },
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
