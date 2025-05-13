"use client";

import { Check, Clock, HelpCircle, X } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { formatDate } from "~/lib/utils";
import type { RouterOutputs } from "~/trpc/react";

interface LastQuizSubmissionProps {
  submission: Exclude<
    RouterOutputs["student"]["courses"]["quizzes"]["getOne"],
    null
  >["submissions"][0];
  totalPoints: number;
}

export function BestQuizSubmission({
  submission,
  totalPoints,
}: LastQuizSubmissionProps) {
  if (!submission) return null;

  const score = submission.grade || 0;
  const scorePercentage =
    totalPoints > 0 ? ((score / totalPoints) * 100).toFixed(1) : "0.0";

  // Determine result status with dark-mode friendly colors
  const getResultStatus = () => {
    const percentage = Number(scorePercentage);
    if (percentage >= 80)
      return { label: "Excellent", color: "bg-emerald-700/60" };
    if (percentage >= 70) return { label: "Good", color: "bg-emerald-800/60" };
    if (percentage >= 60)
      return { label: "Satisfactory", color: "bg-amber-700/60" };
    return { label: "Needs Improvement", color: "bg-rose-800/60" };
  };

  const resultStatus = getResultStatus();

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl">Submission Results</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {formatDate(submission.finishedAt)}
            </Badge>
            <Badge variant="outline">Attempt {submission.attempt}</Badge>
            <Badge className={resultStatus.color}>{resultStatus.label}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score overview */}
        <div className="rounded-md border p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-medium">Your Score</h3>
            <div className="text-lg font-semibold">
              {score}/{totalPoints} points
            </div>
          </div>

          <Progress value={Number(scorePercentage)} className="h-2" />

          <div className="mt-2 text-right text-sm">{scorePercentage}%</div>
        </div>

        {/* Question-by-question breakdown */}
        <h3 className="pt-4 font-medium">Question Breakdown</h3>
        <div className="divide-y rounded-md border">
          {submission.answers &&
            submission.answers.map((answer, index: number) => {
              const question = answer.quizQuestion;
              const isCorrect =
                question.correctAnswer &&
                question.correctAnswer.length > 0 &&
                question.correctAnswer.every((ans: string) =>
                  answer.answer?.includes(ans),
                );

              return (
                <div key={answer.id} className="space-y-4 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-normal">
                          Q{index + 1}
                        </Badge>
                        <Badge variant="secondary">{question.points} pts</Badge>
                      </div>
                      <h4 className="text-base font-medium">
                        {question.question}
                      </h4>
                    </div>

                    <Badge
                      className={
                        isCorrect
                          ? "bg-emerald-700/60 hover:bg-emerald-700/70"
                          : "bg-rose-800/60 hover:bg-rose-800/70"
                      }
                    >
                      {isCorrect ? (
                        <>
                          <Check className="mr-1 h-3.5 w-3.5" />
                          Correct
                        </>
                      ) : (
                        <>
                          <X className="mr-1 h-3.5 w-3.5" />
                          Incorrect
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Display based on question type */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Your answer */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Your Answer:</p>
                      <div
                        className={`rounded-md border p-3 ${
                          isCorrect
                            ? "border-emerald-800/40 bg-emerald-900/20 text-emerald-300"
                            : "border-rose-800/40 bg-rose-900/20 text-rose-300"
                        }`}
                      >
                        {answer.answer && answer.answer.length > 0 ? (
                          answer.answer.map((ans: string, i: number) => (
                            <div key={i} className="text-sm">
                              {ans}
                            </div>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm italic">
                            No answer provided
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Correct answer */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Correct Answer:</p>
                      <div className="rounded-md border border-emerald-800/40 bg-emerald-900/20 p-3 text-emerald-300">
                        {question?.correctAnswer &&
                        question.correctAnswer.length > 0 ? (
                          question.correctAnswer.map(
                            (ans: string, i: number) => (
                              <div key={i} className="text-sm">
                                {ans}
                              </div>
                            ),
                          )
                        ) : (
                          <span className="text-muted-foreground text-sm italic">
                            No correct answer provided
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* For multiple choice, show all options */}
                  {question?.type === "MULTIPLE_CHOICE" && question.options && (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm font-medium">All Options:</p>
                      <div className="space-y-2">
                        {question.options.map((option: string, i: number) => {
                          const isSelected = answer.answer?.includes(option);
                          const isCorrectOption =
                            question.correctAnswer?.includes(option);

                          return (
                            <div
                              key={i}
                              className={`flex items-center gap-2 rounded-md border p-2 ${
                                isSelected && isCorrectOption
                                  ? "border-emerald-800/40 bg-emerald-900/20"
                                  : isSelected
                                    ? "border-rose-800/40 bg-rose-900/20"
                                    : isCorrectOption
                                      ? "border-emerald-800/20 bg-emerald-900/10"
                                      : ""
                              }`}
                            >
                              {isSelected ? (
                                <div
                                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                                    isCorrectOption
                                      ? "bg-emerald-700"
                                      : "bg-rose-800"
                                  }`}
                                >
                                  {isCorrectOption ? (
                                    <Check className="h-3 w-3 text-emerald-100" />
                                  ) : (
                                    <X className="h-3 w-3 text-rose-100" />
                                  )}
                                </div>
                              ) : (
                                <div
                                  className={`h-4 w-4 rounded-full border ${
                                    isCorrectOption
                                      ? "border-emerald-500"
                                      : "border-gray-600"
                                  }`}
                                />
                              )}
                              <span
                                className={`text-sm ${
                                  isCorrectOption
                                    ? "font-medium text-emerald-300"
                                    : isSelected
                                      ? "text-rose-300"
                                      : ""
                                }`}
                              >
                                {option}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
