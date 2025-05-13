import { z } from "zod";
import { createTRPCRouter, professorProcedure } from "~/server/api/trpc";

export const assignmentsRouter = createTRPCRouter({
  get: professorProcedure
    .input(z.object({ sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.assignment.findMany({
        where: {
          courseSectionId: input.sectionId,
          courseSection: {
            professors: { some: { professorId: ctx.session.user.id } },
          },
        },
        select: {
          id: true,
          title: true,
          author: { select: { user: { select: { name: true } } } },
          date: true,
          text: true,
          isPublished: true,
          files: true,
          dueDate: true,
          publishAt: true,
          points: true,
          _count: {
            select: { submissions: true },
          },
        },
      });
    }),
  getOne: professorProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.assignment.findFirst({
        where: {
          id: input.id,
          courseSection: {
            id: input.sectionId,
            professors: { some: { professorId: ctx.session.user.id } },
          },
        },
        select: {
          id: true,
          title: true,
          author: { select: { user: { select: { name: true, image: true } } } },
          date: true,
          files: true,
          text: true,
          isPublished: true,
          dueDate: true,
          maxAttempts: true,
          points: true,
        },
      });
    }),
  submissions: professorProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const submissions = await ctx.db.assignmentSubmission.findMany({
        where: {
          assignmentId: input.id,
          assignment: {
            courseSection: {
              id: input.sectionId,
              professors: { some: { professorId: ctx.session.user.id } },
            },
          },
        },
        select: {
          id: true,
          date: true,
          text: true,
          files: true,
          attempt: true,
          student: {
            select: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
        },
        orderBy: { attempt: "desc" },
      });
      const grades = await ctx.db.assignmentSubmissionGrade.findMany({
        where: {
          assignmentId: input.id,
          assignment: {
            courseSection: {
              id: input.sectionId,
              professors: { some: { professorId: ctx.session.user.id } },
            },
          },
        },
        select: {
          studentId: true,
          grade: true,
          feedback: true,
          isGradePosted: true,
          attempt: true,
        },
      });
      const submissionsWithGrades = submissions.map((submission) => {
        const grade = grades.find(
          (g) =>
            g.studentId === submission.student.user.id &&
            g.attempt === submission.attempt,
        );
        return {
          ...submission,
          grade: {
            grade: grade?.grade,
            feedback: grade?.feedback,
            isGradePosted: grade?.isGradePosted,
          },
        };
      });
      return submissionsWithGrades;
    }),
  grade: professorProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        sectionId: z.number(),
        studentId: z.string(),
        grade: z.number(),
        attempt: z.number(),
        feedback: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the assignment exists and belongs to the professor
      const assignment = await ctx.db.assignment.findFirst({
        where: {
          id: input.assignmentId,
          courseSection: {
            id: input.sectionId,
            professors: { some: { professorId: ctx.session.user.id } },
          },
        },
      });
      if (!assignment) {
        throw new Error("Assignment not found or you do not have access.");
      }

      const exists = await ctx.db.assignmentSubmissionGrade.findFirst({
        where: {
          assignmentId: input.assignmentId,
          studentId: input.studentId,
          attempt: input.attempt,
        },
      });

      return await ctx.db.assignmentSubmissionGrade.upsert({
        where: {
          id: exists?.id || "",
        },
        create: {
          assignmentId: input.assignmentId,
          studentId: input.studentId,
          isGradePosted: true,
          grade: input.grade,
          feedback: input.feedback,
          attempt: input.attempt,
        },
        update: {
          grade: input.grade,
          feedback: input.feedback,
          attempt: input.attempt,
        },
      });
    }),
  create: professorProcedure
    .input(
      z.object({
        sectionId: z.number(),
        title: z.string(),
        text: z.string().optional(),
        files: z
          .array(
            z.object({
              fileKey: z.string(),
              fileType: z.string(),
              fileName: z.string(),
            }),
          )
          .optional(),
        group: z.string().optional(),
        published: z.boolean().optional(),
        points: z.number(),
        dueDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.assignment.create({
        data: {
          title: input.title,
          text: input.text,
          isPublished: input.published,
          courseSectionId: input.sectionId,
          authorId: ctx.session.user.id,
          points: input.points,
          dueDate: input.dueDate,
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
        },
      });
    }),
  publish: professorProcedure
    .input(
      z.object({
        id: z.string(),
        sectionId: z.number(),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.assignment.updateMany({
        where: {
          id: input.id,
          courseSection: {
            id: input.sectionId,
            professors: { some: { professorId: ctx.session.user.id } },
          },
        },
        data: {
          isPublished: input.published,
        },
      });
    }),
  delete: professorProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.assignment.deleteMany({
        where: {
          id: input.id,
          courseSection: {
            id: input.sectionId,
            professors: { some: { professorId: ctx.session.user.id } },
          },
        },
      });
    }),
});
