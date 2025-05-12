import { z } from "zod";
import { createTRPCRouter, studentProcedure } from "~/server/api/trpc";

export const assignmentsRouter = createTRPCRouter({
  get: studentProcedure
    .input(z.object({ sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.assignment.findMany({
        where: {
          courseSectionId: input.sectionId,
          isPublished: true,
          courseSection: {
            students: { some: { studentId: ctx.session.user.id } },
          },
        },
        select: {
          id: true,
          title: true,
          author: { select: { user: { select: { name: true } } } },
          date: true,
          text: true,
          files: true,
          dueDate: true,
          points: true,
          grades: {
            select: {
              grade: true,
            },
            where: {
              studentId: ctx.session.user.id,
              isGradePosted: true,
            },
            orderBy: { attempt: "desc" },
          },
          submissions: {
            where: { studentId: ctx.session.user.id },
            select: {
              id: true,
              date: true,
            },
          },
        },
        orderBy: { dueDate: "asc" },
      });
    }),
  getOne: studentProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.assignment.findFirst({
        where: {
          id: input.id,
          courseSection: {
            id: input.sectionId,
            students: { some: { studentId: ctx.session.user.id } },
          },
        },
        select: {
          id: true,
          title: true,
          author: { select: { user: { select: { name: true, image: true } } } },
          date: true,
          files: true,
          text: true,
          dueDate: true,
          maxAttempts: true,
          points: true,
          grades: {
            select: {
              grade: true,
              attempt: true,
              feedback: true,
              date: true,
              id: true,
            },
            where: {
              studentId: ctx.session.user.id,
              isGradePosted: true,
            },
            orderBy: { attempt: "desc" },
          },
          submissions: {
            where: { studentId: ctx.session.user.id },
            select: {
              id: true,
              text: true,
              attempt: true,
              date: true,
              files: true,
            },
          },
        },
      });
    }),
  submit: studentProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        sectionId: z.number(),
        files: z
          .array(
            z.object({
              fileKey: z.string(),
              fileType: z.string(),
              fileName: z.string(),
            }),
          )
          .optional(),
        text: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check deadline
      const assignment = await ctx.db.assignment.findFirst({
        where: {
          id: input.assignmentId,
          courseSection: {
            id: input.sectionId,
            students: { some: { studentId: ctx.session.user.id } },
          },
        },
        select: { dueDate: true, maxAttempts: true },
      });
      if (!assignment) {
        throw new Error("Assignment not found.");
      }
      if (assignment && assignment.dueDate) {
        const now = new Date();
        if (now > assignment.dueDate) {
          throw new Error("Assignment submission deadline has passed.");
        }
      }

      // Count previous attempts
      const prevAttempts = await ctx.db.assignmentSubmission.count({
        where: {
          assignmentId: input.assignmentId,
          studentId: ctx.session.user.id,
        },
      });

      // Check max attempts
      if (assignment.maxAttempts && prevAttempts >= assignment.maxAttempts) {
        throw new Error("Maximum attempts reached.");
      }

      // Create submission
      return await ctx.db.assignmentSubmission.create({
        data: {
          assignmentId: input.assignmentId,
          studentId: ctx.session.user.id,
          text: input.text,
          files: {
            createMany: {
              data:
                input.files?.map((file) => ({
                  link: file.fileKey,
                  type: file.fileType,
                  name: file.fileName,
                })) || [],
            },
          },
          attempt: prevAttempts + 1,
        },
      });
    }),
});
