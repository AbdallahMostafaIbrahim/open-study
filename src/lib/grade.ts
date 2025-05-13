import type { PrismaClient } from "@prisma/client";

export async function grade(ctx: PrismaClient, submissionId: string) {
  const answers = await ctx.quizAnswer.findMany({
    where: {
      quizSubmissionId: submissionId,
    },
    select: {
      answer: true,
      quizQuestion: {
        select: {
          id: true,
          points: true,
          correctAnswer: true,
        },
      },
    },
  });

  const grade = answers.reduce((acc, answer) => {
    const questionPoints = answer.quizQuestion.points;
    const isCorrect = answer.answer.every((ans) =>
      answer.quizQuestion.correctAnswer.includes(ans),
    );
    return acc + (isCorrect ? questionPoints : 0);
  }, 0);

  // Update the submission with the grade
  await ctx.quizSubmission.update({
    where: { id: submissionId },
    data: {
      grade,
    },
  });
}
