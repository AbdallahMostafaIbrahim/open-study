import { z } from "zod";
import { grade } from "~/lib/grade";
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
              attempt: true,
              answers: {
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
                      correctAnswer: true,
                    },
                  },
                },
                orderBy: { quizQuestion: { order: "asc" } },
              },
            },
            where: { studentId: ctx.session.user.id },
            orderBy: { attempt: "asc" },
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
          maxAttempts: true,
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
        orderBy: {
          attempt: "desc",
        },
      });
      const attempts = await ctx.db.quizSubmission.count({
        where: {
          quizId: input.id,
          studentId: ctx.session.user.id,
        },
      });

      // If the existing quiz has not been finished, just return true
      if (existingSubmission && !existingSubmission.finishedAt) {
        return true;
      }

      // Check the attempts first
      if (quiz.maxAttempts && attempts >= quiz.maxAttempts) {
        throw new Error("You have reached the maximum number of attempts");
      }

      // Create a new quiz submission
      const quizSubmission = await ctx.db.quizSubmission.create({
        data: {
          quizId: input.id,
          studentId: ctx.session.user.id,
          attempt: attempts + 1,
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

      return true;
    }),
  session: studentProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const quiz = await ctx.db.quiz.findFirst({
        where: {
          id: input.id,
          courseSection: {
            id: input.sectionId,
            students: { some: { studentId: ctx.session.user.id } },
          },
          isPublished: true,
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
        select: {
          id: true,
          finishedAt: true,
          attempt: true,
          startedAt: true,
          currentQuestionIndex: true,
          quiz: {
            select: {
              id: true,
              title: true,
              description: true,
              dueDate: true,
              maxAttempts: true,
              durationInSeconds: true,
              points: true,
              isPublished: true,
            },
          },
          answers: {
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
          },
        },
        orderBy: { attempt: "desc" },
      });

      if (!existingSubmission) {
        throw new Error("You have not started this quiz");
      }

      if (existingSubmission.finishedAt) {
        throw new Error("You have already finished this quiz");
      }

      // check the time limit from the duration of the quiz and the startedAt date
      const timeLimit = quiz.durationInSeconds;
      if (!timeLimit) {
        return existingSubmission;
      }
      const startedAt = existingSubmission.startedAt;
      const currentTime = new Date();
      const timeElapsed = Math.floor(
        (currentTime.getTime() - startedAt!.getTime()) / 1000,
      );
      const timeRemaining = timeLimit - timeElapsed;
      const isTimeUp = timeRemaining <= 0;
      if (isTimeUp) {
        // If time is up, finish the quiz
        await ctx.db.quizSubmission.update({
          where: { id: existingSubmission.id },
          data: {
            finishedAt: new Date(),
            currentQuestionIndex: existingSubmission.currentQuestionIndex,
          },
        });

        await grade(ctx.db, existingSubmission.id);

        throw new Error("Time is up");
      }

      return existingSubmission;
    }),
  answer: studentProcedure
    .input(
      z.object({
        id: z.string(),
        sectionId: z.number(),
        questionId: z.string(),
        answer: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.db.quiz.findFirst({
        where: {
          id: input.id,
          courseSection: {
            id: input.sectionId,
            students: { some: { studentId: ctx.session.user.id } },
          },
          isPublished: true,
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
        select: {
          id: true,
          finishedAt: true,
          attempt: true,
          startedAt: true,
          currentQuestionIndex: true,
        },
        orderBy: { attempt: "desc" },
      });

      if (!existingSubmission) {
        throw new Error("You have not started this quiz");
      }

      if (existingSubmission.finishedAt) {
        throw new Error("You have already finished this quiz");
      }

      // Update the answer
      await ctx.db.quizAnswer.updateMany({
        where: {
          quizQuestionId: input.questionId,
          quizSubmissionId: existingSubmission.id,
        },
        data: {
          answer: input.answer,
          isTouched: true,
        },
      });

      return true;
    }),
  submit: studentProcedure
    .input(z.object({ id: z.string(), sectionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.db.quiz.findFirst({
        where: {
          id: input.id,
          courseSection: {
            id: input.sectionId,
            students: { some: { studentId: ctx.session.user.id } },
          },
          isPublished: true,
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
        select: {
          id: true,
          finishedAt: true,
          attempt: true,
          startedAt: true,
          currentQuestionIndex: true,
        },
        orderBy: { attempt: "desc" },
      });

      if (!existingSubmission) {
        throw new Error("You have not started this quiz");
      }

      if (existingSubmission.finishedAt) {
        throw new Error("You have already finished this quiz");
      }

      // Finish the quiz
      await ctx.db.quizSubmission.update({
        where: { id: existingSubmission.id },
        data: {
          finishedAt: new Date(),
          currentQuestionIndex: existingSubmission.currentQuestionIndex,
        },
      });

      // Calculate the grade
      await grade(ctx.db, existingSubmission.id);

      return true;
    }),
});
