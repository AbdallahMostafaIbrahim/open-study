import { AlertCircle, AlertTriangle, Calendar } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";

interface DueDateDisplayProps {
  dueDate: Date | null | undefined;
  isDueDatePassed: boolean;
  isCloseToDeadline: boolean;
}

export function DueDateDisplay({
  dueDate,
  isDueDatePassed,
  isCloseToDeadline,
}: DueDateDisplayProps) {
  if (!dueDate) return null;

  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // Calculate time remaining until due date
  const getTimeRemaining = () => {
    if (!dueDate) return null;

    const now = new Date();
    const diff = new Date(dueDate).getTime() - now.getTime();
    if (diff <= 0) return "Past due";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ${hours} hour${hours > 1 ? "s" : ""} remaining`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""} remaining`;
    }
  };

  const timeRemaining = getTimeRemaining();

  return (
    <>
      <Badge
        variant={
          isDueDatePassed
            ? "destructive"
            : isCloseToDeadline
              ? "default"
              : "outline"
        }
        className={
          isCloseToDeadline && !isDueDatePassed
            ? "bg-amber-500 hover:bg-amber-500"
            : ""
        }
      >
        <Calendar className="mr-1 h-3.5 w-3.5" />
        {isDueDatePassed ? "Past due" : `Due: ${formatDate(dueDate)}`}
      </Badge>
    </>
  );
}
