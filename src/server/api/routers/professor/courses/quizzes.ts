import { QuestionType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, professorProcedure } from "~/server/api/trpc";

export const quizzesRouter = createTRPCRouter({
  get: professorProcedure
    .input(z.object({ sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.quiz.findMany({
        where: {
          courseSectionId: input.sectionId,
          courseSection: {
            professors: { some: { professorId: ctx.session.user.id } },
          },
        },
        select: {
          id: true,
          title: true,
          dueDate: true,
          points: true,
          durationInSeconds: true,
          isPublished: true,
          _count: {
            select: {
              submissions: { where: { attempt: 1 } },
              questions: true,
            },
          },
        },
        orderBy: { dueDate: "asc" },
      });
    }),
  getOne: professorProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.quiz.findFirst({
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
          description: true,
          dueDate: true,
          maxAttempts: true,
          points: true,
          isPublished: true,
          durationInSeconds: true,
          _count: {
            select: {
              submissions: { where: { attempt: 1 } },
            },
          },
          questions: {
            select: {
              id: true,
              question: true,
              type: true,
              points: true,
              order: true,
              correctAnswer: true,
              options: true,
            },
            orderBy: { order: "asc" },
          },
        },
      });
    }),
  submissions: professorProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.quizSubmission.findMany({
        where: {
          quizId: input.id,
          quiz: {
            courseSection: {
              id: input.sectionId,
              professors: { some: { professorId: ctx.session.user.id } },
            },
          },
        },
        select: {
          id: true,
          date: true,
          grade: true,
          feedback: true,
          isGradePosted: true,
          attempt: true,
          startedAt: true,
          finishedAt: true,
          student: {
            select: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
          answers: {
            select: {
              id: true,
              answer: true,
              grade: true,
              quizQuestion: {
                select: {
                  id: true,
                  question: true,
                  type: true,
                  points: true,
                  options: true,
                },
              },
            },
          },
        },
        orderBy: { date: "desc" },
      });
    }),
  grade: professorProcedure
    .input(
      z.object({
        quizSubmissionId: z.string(),
        sectionId: z.number(),
        grade: z.number().nullable(),
        feedback: z.string().optional(),
        answerGrades: z
          .array(
            z.object({
              answerId: z.string(),
              grade: z.number().nullable(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the quiz exists and belongs to the professor
      const submission = await ctx.db.quizSubmission.findFirst({
        where: {
          id: input.quizSubmissionId,
          quiz: {
            courseSection: {
              id: input.sectionId,
              professors: { some: { professorId: ctx.session.user.id } },
            },
          },
        },
        include: {
          answers: true,
        },
      });

      if (!submission) {
        throw new Error("Quiz submission not found or you do not have access.");
      }

      // Update answer grades if provided
      if (input.answerGrades && input.answerGrades.length > 0) {
        for (const answerGrade of input.answerGrades) {
          await ctx.db.quizAnswer.update({
            where: { id: answerGrade.answerId },
            data: { grade: answerGrade.grade },
          });
        }
      }

      // Update the overall quiz submission grade
      return await ctx.db.quizSubmission.update({
        where: { id: input.quizSubmissionId },
        data: {
          grade: input.grade,
          feedback: input.feedback,
          isGradePosted: true,
        },
      });
    }),
  create: professorProcedure
    .input(
      z.object({
        sectionId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        points: z.number(),
        dueDate: z.date().optional(),
        maxAttempts: z.number().optional(),
        isPublished: z.boolean().optional().default(false),
        durationInSeconds: z.number().optional(),
        questions: z.array(
          z.object({
            question: z.string(),
            type: z.nativeEnum(QuestionType),
            points: z.number(),
            order: z.number(),
            correctAnswer: z.array(z.string()).optional(),
            options: z.array(z.string()).optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.quiz.create({
        data: {
          title: input.title,
          description: input.description,
          isPublished: input.isPublished,
          courseSectionId: input.sectionId,
          points: input.points,
          dueDate: input.dueDate,
          durationInSeconds: input.durationInSeconds,
          maxAttempts: input.maxAttempts,
          questions: {
            create: input.questions.map((q) => ({
              question: q.question,
              type: q.type,
              points: q.points,
              order: q.order,
              options: q.options,
              correctAnswer: q.correctAnswer,
            })),
          },
        },
      });
    }),
  updateQuestion: professorProcedure
    .input(
      z.object({
        questionId: z.string(),
        sectionId: z.number(),
        question: z.string().optional(),
        type: z.nativeEnum(QuestionType).optional(),
        points: z.number().optional(),
        order: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify access to the question
      const questionExists = await ctx.db.quizQuestion.findFirst({
        where: {
          id: input.questionId,
          quiz: {
            courseSection: {
              id: input.sectionId,
              professors: { some: { professorId: ctx.session.user.id } },
            },
          },
        },
      });

      if (!questionExists) {
        throw new Error("Question not found or you do not have access.");
      }

      return await ctx.db.quizQuestion.update({
        where: { id: input.questionId },
        data: {
          question: input.question,
          type: input.type,
          points: input.points,
          order: input.order,
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
      return await ctx.db.quiz.updateMany({
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
      return await ctx.db.quiz.deleteMany({
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
