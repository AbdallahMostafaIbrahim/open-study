import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const professorsRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.professor.findMany({
      select: {
        user: {
          select: { id: true, email: true, name: true },
        },
        _count: { select: { courses: true } },
      },
      where: { user: { organizationId: input } },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        professorId: z.string(),
        organizationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.create({
        data: {
          email: input.email,
          name: input.name,
          organizationId: input.organizationId,
          professor: { create: { professorId: input.professorId } },
        },
      });
    }),
});
