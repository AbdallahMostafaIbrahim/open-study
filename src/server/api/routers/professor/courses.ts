import { createTRPCRouter, professorProcedure } from "~/server/api/trpc";

export const coursesRouter = createTRPCRouter({
  get: professorProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.courseSection.findMany({
      select: {
        id: true,
        sectionNumber: true,
        _count: { select: { students: true } },
        course: {
          select: {
            id: true,
            name: true,
            description: true,
            courseCode: true,
          },
        },
      },
      where: {
        professors: {
          some: {
            professorId: ctx.session.user.id,
          },
        },
      },
    });
  }),
});
