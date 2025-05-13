import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";

interface QuestionNavigatorProps {
  currentIndex: number;
  totalQuestions: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function QuestionNavigator({
  currentIndex,
  totalQuestions,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting = false,
}: QuestionNavigatorProps) {
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="mt-8 flex items-center justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion || isSubmitting}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Button>

      <span className="text-muted-foreground text-sm">
        Question {currentIndex + 1} of {totalQuestions}
      </span>

      {isLastQuestion ? (
        <Button onClick={onSubmit} className="gap-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Submit Quiz
            </>
          )}
        </Button>
      ) : (
        <Button onClick={onNext} className="gap-2" disabled={isSubmitting}>
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
