import { z } from "zod";
import { createTRPCRouter, studentProcedure } from "~/server/api/trpc";

export const materialRouter = createTRPCRouter({
  get: studentProcedure
    .input(z.object({ sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.material.findMany({
        where: {
          courseSectionId: input.sectionId,
          isPublished: true,
          courseSection: {
            students: { some: { studentId: ctx.session.user.id } },
          },
        },
        select: {
          id: true,
          title: true,
          author: { select: { user: { select: { name: true } } } },
          date: true,
          text: true,
          group: true,
          files: true,
        },
      });
    }),

  getOne: studentProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.material.findFirst({
        where: {
          id: input.id,
          courseSection: {
            id: input.sectionId,
            students: { some: { studentId: ctx.session.user.id } },
          },
        },
        select: {
          id: true,
          title: true,
          author: { select: { user: { select: { name: true, image: true } } } },
          date: true,
          files: true,
          text: true,
          group: true,
        },
      });
    }),
});
