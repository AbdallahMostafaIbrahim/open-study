import { createTRPCRouter, studentProcedure } from "~/server/api/trpc";

export const miscRouter = createTRPCRouter({
  currentSemesters: studentProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.semester.findMany({
      where: {
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
        organizationId: ctx.session.user.student.organizationId,
      },
    });
  }),
});
