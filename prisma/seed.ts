import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const seed = async () => {
  await client.user.create({
    data: {
      email: "energysandwich@aucegypt.edu",
      name: "Abdallah Mostafa", // Add name or any other required fields
      admin: { create: {} },
    },
  });
  //   const user = await client.user.findFirst({
  //     where: {
  //       email: {
  //         in: [
  //           "abdallahmostafaibrahim@gmail.com",
  //           "ali.mohamed.farouk@gmail.com",
  //         ],
  //       },
  //     },
  //   });

  //   if (user && !user?.isAdmin) {
  //     await client.user.update({
  //       where: { id: user?.id },
  //       data: { isAdmin: true, admin: { create: {} } },
  //     });
  //   }

  await client.$disconnect();
};

seed();
