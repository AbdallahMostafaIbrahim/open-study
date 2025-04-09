import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const studentsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.student.findMany({
      select: {},
    });
  }),
});
