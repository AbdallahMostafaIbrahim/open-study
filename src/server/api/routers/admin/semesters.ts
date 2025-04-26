import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";

export const semestersRouter = createTRPCRouter({
  get: adminProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.semester.findMany({
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        _count: { select: { sections: true } },
      },
      where: {
        organizationId: input,
      },
    });
  }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        organizationId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.semester.create({
        data: {
          name: input.name,
          startDate: input.startDate,
          endDate: input.endDate,
          organizationId: input.organizationId,
        },
      });
    }),
});
