import { z } from "zod";
import { createTRPCRouter, professorProcedure } from "~/server/api/trpc";
import { announcementsRouter } from "./announcements";
import { assignmentsRouter } from "./assignments";
import { materialRouter } from "./material";
import { quizzesRouter } from "./quizzes";

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
  getOne: professorProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.courseSection.findUnique({
      where: {
        id: input,
        professors: { some: { professorId: ctx.session.user.id } },
      },
      include: {
        course: true,
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
        _count: {
          select: {
            students: true,
            materials: true,
            assignments: true,
            quizzes: true,
          },
        },
      },
    });
  }),
  material: materialRouter,
  assignments: assignmentsRouter,
  announcements: announcementsRouter,
  quizzes: quizzesRouter,
});
