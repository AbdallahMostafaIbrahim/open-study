import { z } from "zod";
import { createTRPCRouter, studentProcedure } from "~/server/api/trpc";

export const quizzesRouter = createTRPCRouter({
  get: studentProcedure
    .input(z.object({ sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.quiz.findMany({
        where: {
          courseSectionId: input.sectionId,
          courseSection: {
            students: { some: { studentId: ctx.session.user.id } },
          },
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          dueDate: true,
          points: true,
          durationInSeconds: true,
          _count: {
            select: {
              questions: true,
            },
          },
        },
        orderBy: { dueDate: "asc" },
      });
    }),
  getOne: studentProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.quiz.findFirst({
        where: {
          id: input.id,
          courseSection: {
            id: input.sectionId,
            students: { some: { studentId: ctx.session.user.id } },
          },
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          description: true,
          dueDate: true,
          maxAttempts: true,
          durationInSeconds: true,
          points: true,
          isPublished: true,
          questions: {
            select: {
              id: true,
              question: true,
              type: true,
              points: true,
              order: true,
            },
            orderBy: { order: "asc" },
          },
          submissions: {
            select: {
              id: true,
              finishedAt: true,
              grade: true,
            },
            where: { studentId: ctx.session.user.id },
          },
          _count: { select: { questions: true } },
        },
      });
    }),
  start: studentProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if student can start quiz
      const quiz = await ctx.db.quiz.findFirst({
        where: {
          id: input.id,
          courseSection: {
            id: input.sectionId,
            students: { some: { studentId: ctx.session.user.id } },
          },
          isPublished: true,
        },
        select: {
          questions: {
            select: {
              id: true,
              question: true,
              type: true,
              points: true,
              order: true,
            },
            orderBy: { order: "asc" },
          },
        },
      });
      if (!quiz) {
        throw new Error("Quiz not found or not published");
      }

      // Check if student has already started the quiz
      const existingSubmission = await ctx.db.quizSubmission.findFirst({
        where: {
          quizId: input.id,
          studentId: ctx.session.user.id,
        },
      });

      if (existingSubmission?.finishedAt) {
        throw new Error("You have already finished this quiz");
      }
      let quizSubmissionId = existingSubmission?.id;
      if (!existingSubmission) {
        const quizSubmission = await ctx.db.quizSubmission.create({
          data: {
            quizId: input.id,
            studentId: ctx.session.user.id,
          },
        });

        //   Create all quiz answers
        await ctx.db.quizAnswer.createMany({
          data: quiz.questions.map((question) => ({
            index: 0,
            quizSubmissionId: quizSubmission.id,
            quizQuestionId: question.id,
            answer: [],
            isTouched: false,
          })),
        });

        quizSubmissionId = quizSubmission.id;
      }

      // Return quiz questions
      return await ctx.db.quizAnswer.findMany({
        where: {
          quizSubmissionId: quizSubmissionId,
        },
        select: {
          id: true,
          answer: true,
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
        orderBy: { quizQuestion: { order: "asc" } },
      });
    }),
});
