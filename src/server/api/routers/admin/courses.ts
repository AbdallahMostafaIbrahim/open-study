import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const coursesRouter = createTRPCRouter({
  get: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.course.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: { select: { sections: true } },
      },
      where: {
        organizationId: input,
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        organizationId: z.number(),
        sections: z.array(
          z.object({
            sectionNumber: z.string(),
            startDate: z.date(),
            endDate: z.date(),
            professors: z.array(z.string()),
            students: z.array(z.string()),
            semesterId: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.course.create({
        data: {
          name: input.name,
          description: input.description,
          organizationId: input.organizationId,
          sections: {
            createMany: {
              data: input.sections.map((section) => ({
                sectionNumber: section.sectionNumber,
                startDate: section.startDate,
                endDate: section.endDate,
                professors: {
                  connect: section.professors.map((professorId) => ({
                    id: professorId,
                  })),
                },
                students: {
                  connect: section.students.map((studentId) => ({
                    id: studentId,
                  })),
                },
                semesterId: section.semesterId,
              })),
            },
          },
        },
      });
    }),
});
