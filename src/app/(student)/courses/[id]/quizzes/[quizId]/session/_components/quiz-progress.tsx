interface QuizProgressProps {
  questions: { id: string; isTouched: boolean }[];
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
}

export function QuizProgress({
  questions,
  currentIndex,
  onSelectQuestion,
}: QuizProgressProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Progress</h3>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => (
          <button
            key={question.id}
            className={`flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium ${
              index === currentIndex
                ? "border-primary bg-primary text-primary-foreground border-2"
                : question.isTouched
                  ? "bg-muted text-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted/50"
            }`}
            onClick={() => onSelectQuestion(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <div className="bg-muted h-3 w-3 rounded-full"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="bg-background h-3 w-3 rounded-full border"></div>
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
}
