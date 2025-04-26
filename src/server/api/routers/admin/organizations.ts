import { z } from "zod";

import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const organizationsRouter = createTRPCRouter({
  get: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.organization.findMany({
      select: {
        id: true,
        name: true,
        country: true,
        contactEmail: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
    });
  }),
  getOne: adminProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.organization.findUnique({
      where: { id: input },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });
  }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        country: z.string().min(1),
        contactEmail: z.string().email(),
        logo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.organization.create({
        data: {
          name: input.name,
          country: input.country,
          contactEmail: input.contactEmail,
          logo: input.logo,
          createdAt: new Date(),
        },
      });
    }),
});
