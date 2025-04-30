import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const seed = async () => {
  await client.user.create({
    data: {
      email: "energysandwich@aucegypt.edu",
      name: "Abdallah Mostafa",
      admin: { create: {} },
    },
  });
  await client.user.create({
    data: {
      email: "yousefm@aucegypt.edu",
      name: "Youssef Hawash",
      admin: { create: {} },
    },
  });

  await client.$disconnect();
};

seed();
