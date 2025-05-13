import { BookOpen } from "lucide-react";

interface QuizHeaderProps {
  title: string;
  attempt: number;
}

export function QuizHeader({ title, attempt }: QuizHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="text-muted-foreground text-sm">Attempt {attempt}</div>
    </div>
  );
}
