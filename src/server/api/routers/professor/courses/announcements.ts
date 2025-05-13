import { z } from "zod";
import { createTRPCRouter, professorProcedure } from "~/server/api/trpc";

export const announcementsRouter = createTRPCRouter({
  get: professorProcedure
    .input(z.object({ sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.annoucement.findMany({
        where: {
          courseSectionId: input.sectionId,
          courseSection: {
            professors: { some: { professorId: ctx.session.user.id } },
          },
        },
        select: {
          id: true,
          title: true,
          content: true,
          author: {
            select: { user: { select: { name: true, image: true, id: true } } },
          },
          date: true,
        },
        orderBy: {
          date: "desc",
        },
      });
    }),
  create: professorProcedure
    .input(
      z.object({
        sectionId: z.number(),
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.annoucement.create({
        data: {
          title: input.title,
          content: input.content,
          courseSectionId: input.sectionId,
          authorId: ctx.session.user.id,
        },
      });
    }),
});
