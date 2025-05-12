import { z } from "zod";
import { createTRPCRouter, studentProcedure } from "~/server/api/trpc";
import { assignmentsRouter } from "./assignment";
import { materialRouter } from "./material";

export const coursesRouter = createTRPCRouter({
  get: studentProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.courseSection.findMany({
      select: {
        id: true,
        sectionNumber: true,
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
        students: { some: { studentId: ctx.session.user.id } },
      },
    });
  }),
  getOne: studentProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.courseSection.findUnique({
      where: {
        id: input,
        students: { some: { studentId: ctx.session.user.id } },
      },
      include: {
        course: true,
        students: {
          select: {
            id: true,
            isActive: true,
            student: {
              select: {
                user: { select: { name: true, email: true, image: true } },
                studentId: true,
              },
            },
          },
        },
        professors: {
          select: {
            id: true,
            isActive: true,
            type: true,
            professor: {
              select: {
                user: { select: { name: true, email: true } },
                professorId: true,
              },
            },
          },
        },
        _count: {
          select: {
            students: true,
            materials: true,
            assignments: true,
            quizes: true,
          },
        },
      },
    });
  }),
  material: materialRouter,
  assignments: assignmentsRouter,
});
