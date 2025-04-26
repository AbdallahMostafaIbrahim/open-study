import { z } from "zod";

import { createTRPCRouter, professorProcedure } from "~/server/api/trpc";

export const miscRouter = createTRPCRouter({
  currentSemesters: professorProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.semester.findMany({
      where: {
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
        organizationId: ctx.session.user.professor.organizationId,
      },
    });
  }),
});
