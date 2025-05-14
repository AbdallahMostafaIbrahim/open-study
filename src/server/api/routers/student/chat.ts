import { createTRPCRouter, studentProcedure } from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
  getMaterial: studentProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.materialFile.findMany({
      where: {
        material: {
          courseSection: {
            students: {
              some: {
                studentId: ctx.session.user.id,
              },
            },
          },
        },
      },
      select: {
        link: true,
        name: true,
        type: true,
      },
    });
  }),
});
