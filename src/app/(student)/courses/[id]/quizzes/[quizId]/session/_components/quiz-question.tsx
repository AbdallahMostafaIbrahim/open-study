import { CheckSquare, Square } from "lucide-react";

interface QuizQuestionProps {
  question: {
    id: string;
    question: string;
    type: string;
    points: number;
    options: string[];
  };
  currentAnswer: string[];
  onChange: (answer: string[]) => void;
}

export function QuizQuestion({
  question,
  currentAnswer,
  onChange,
}: QuizQuestionProps) {
  // Handle selecting a multiple choice option
  const handleSelectOption = (option: string) => {
    if (question.type === "MULTIPLE_CHOICE") {
      // If this is a multiple choice question, toggle the selection
      const newAnswer = currentAnswer.includes(option)
        ? currentAnswer.filter((a) => a !== option)
        : [...currentAnswer, option];

      onChange(newAnswer);
    } else {
      // For single choice, replace the current answer
      onChange([option]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{question.question}</h2>
        <span className="text-muted-foreground text-sm">
          {question.points} {question.points === 1 ? "point" : "points"}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {question.options.map((option) => (
          <div
            key={option}
            className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors ${
              currentAnswer.includes(option)
                ? "border-primary bg-primary/5"
                : "hover:bg-muted/50"
            }`}
            onClick={() => handleSelectOption(option)}
          >
            {currentAnswer.includes(option) ? (
              <CheckSquare className="text-primary h-5 w-5" />
            ) : (
              <Square className="text-muted-foreground h-5 w-5" />
            )}
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
