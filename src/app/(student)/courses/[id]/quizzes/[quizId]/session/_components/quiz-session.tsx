"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { QuestionNavigator } from "./question-navigator";
import { QuizHeader } from "./quiz-header";
import { QuizProgress } from "./quiz-progress";
import { QuizQuestion } from "./quiz-question";
import { QuizTimer } from "./quiz-timer";

interface QuizSessionProps {
  submission: any; // Use the actual type from your API
  sectionId: number;
}

export function QuizSession({ submission, sectionId }: QuizSessionProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(
    submission.currentQuestionIndex,
  );
  const [answers, setAnswers] = useState<Record<string, string[]>>(
    submission.answers.reduce((acc: Record<string, string[]>, answer: any) => {
      acc[answer.quizQuestion.id] = answer.answer;
      return acc;
    }, {}),
  );
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = submission.answers[currentIndex]?.quizQuestion;

  // Save answer mutation
  const answerMutation = api.student.courses.quizzes.answer.useMutation({
    onError: (error) => {
      toast.error(`Failed to save answer: ${error.message}`);
    },
  });

  // Submit quiz mutation
  const submitMutation = api.student.courses.quizzes.submit.useMutation({
    onSuccess: () => {
      toast.success("Quiz submitted successfully!");
      // Navigate to the results page
      router.push(`/courses/${sectionId}/quizzes/${submission.quiz.id}`);
    },
    onError: (error) => {
      toast.error(`Failed to submit quiz: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // Save current answer to the database
  const saveAnswer = async (questionId: string, answer: string[]) => {
    try {
      await answerMutation.mutateAsync({
        id: submission.quiz.id,
        sectionId,
        questionId,
        answer,
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  // Handle answer change
  const handleAnswerChange = (questionId: string, answer: string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Navigate to next question
  const handleNext = async () => {
    if (currentQuestion) {
      await saveAnswer(currentQuestion.id, answers[currentQuestion.id] || []);
    }

    if (currentIndex < submission.answers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrevious = async () => {
    if (currentQuestion) {
      await saveAnswer(currentQuestion.id, answers[currentQuestion.id] || []);
    }

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Open the submit confirmation dialog
  const openSubmitDialog = async () => {
    // Save current answer first
    if (currentQuestion) {
      await saveAnswer(currentQuestion.id, answers[currentQuestion.id] || []);
    }
    setIsSubmitDialogOpen(true);
  };

  // Handle quiz submission
  const handleSubmitQuiz = async () => {
    try {
      setIsSubmitting(true);

      // Submit the quiz
      await submitMutation.mutateAsync({
        id: submission.quiz.id,
        sectionId,
      });

      // Note: Navigation will happen in the onSuccess handler of the mutation
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setIsSubmitting(false);
    }
  };

  // Handle forced submission (e.g., when timer expires)
  const handleForcedSubmit = async () => {
    try {
      // Save current answer first
      if (currentQuestion) {
        await saveAnswer(currentQuestion.id, answers[currentQuestion.id] || []);
      }

      toast.warning("Time's up! Submitting your quiz...");

      // Submit the quiz
      await submitMutation.mutateAsync({
        id: submission.quiz.id,
        sectionId,
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz. Please try again.");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <QuizHeader title={submission.quiz.title} attempt={submission.attempt} />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card className="p-6">
            {currentQuestion && (
              <QuizQuestion
                question={currentQuestion}
                currentAnswer={answers[currentQuestion.id] || []}
                onChange={(answer) =>
                  handleAnswerChange(currentQuestion.id, answer)
                }
              />
            )}

            <QuestionNavigator
              currentIndex={currentIndex}
              totalQuestions={submission.answers.length}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={openSubmitDialog}
            />
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <QuizTimer
              startTime={new Date(submission.startedAt)}
              durationInSeconds={submission.quiz.durationInSeconds}
              onTimeUp={handleForcedSubmit}
            />
          </Card>

          <Card className="p-4">
            <QuizProgress
              questions={submission.answers.map((a: any) => ({
                id: a.quizQuestion.id,
                isTouched: a.answer.length > 0,
              }))}
              currentIndex={currentIndex}
              onSelectQuestion={(index) => {
                if (currentQuestion) {
                  saveAnswer(
                    currentQuestion.id,
                    answers[currentQuestion.id] || [],
                  ).then(() => setCurrentIndex(index));
                } else {
                  setCurrentIndex(index);
                }
              }}
            />
          </Card>
        </div>
      </div>

      {/* Submission Confirmation Dialog */}
      <AlertDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your quiz? You won't be able to
              change your answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleSubmitQuiz();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
