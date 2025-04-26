import { z } from "zod";

import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const coursesRouter = createTRPCRouter({
  get: adminProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.courseSection.findMany({
      select: {
        id: true,
        sectionNumber: true,
        _count: { select: { students: true } },
        course: {
          select: {
            id: true,
            name: true,
            courseCode: true,
          },
        },
      },
      where: {
        professors: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  }),
});
