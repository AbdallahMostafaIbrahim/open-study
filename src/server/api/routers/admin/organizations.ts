import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const organizationsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.organization.findMany({
      select: {
        id: true,
        name: true,
        country: true,
        contactEmail: true,
        _count: {
          select: {
            users: {
              where: { student: { isNot: null } },
            },
          },
        },
      },
    });
  }),
  getOne: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.organization.findUnique({
      where: { id: input },
    });
  }),
  create: protectedProcedure
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
