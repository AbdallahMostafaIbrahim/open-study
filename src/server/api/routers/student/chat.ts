import { createTRPCRouter, studentProcedure } from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
  getMaterial: studentProcedure.query(async ({ ctx, input }) => {
    const materialFiles = await ctx.db.materialFile.findMany({
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

    const assignmentFiles = await ctx.db.assignmentFile.findMany({
      where: {
        assignment: {
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

    return [
      ...materialFiles.map((file) => ({
        ...file,
        type: "material",
      })),
      ...assignmentFiles.map((file) => ({
        ...file,
        type: "assignment",
      })),
    ];
  }),
});
