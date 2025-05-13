import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "~/components/ui/progress";

interface QuizTimerProps {
  startTime: Date;
  durationInSeconds: number;
  onTimeUp: () => void;
}

export function QuizTimer({
  startTime,
  durationInSeconds,
  onTimeUp,
}: QuizTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  const [percentageRemaining, setPercentageRemaining] = useState(100);
  const [timerExpired, setTimerExpired] = useState(false);

  // Calculate time remaining in seconds
  function calculateTimeRemaining() {
    const endTime = new Date(startTime.getTime() + durationInSeconds * 1000);
    const now = new Date();
    const diffInSeconds = Math.max(
      0,
      Math.floor((endTime.getTime() - now.getTime()) / 1000),
    );
    return diffInSeconds;
  }

  // Format seconds to mm:ss
  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      setPercentageRemaining((remaining / durationInSeconds) * 100);

      if (remaining <= 0 && !timerExpired) {
        setTimerExpired(true);
        clearInterval(timer);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [durationInSeconds, startTime, onTimeUp, timerExpired]);

  const isLowTime = timeRemaining < 60; // Less than a minute

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Time Remaining</h3>

      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span
          className={`text-lg font-bold ${isLowTime ? "animate-pulse text-red-500" : ""}`}
        >
          {timerExpired ? "00:00" : formatTime(timeRemaining)}
        </span>
      </div>

      <Progress
        value={percentageRemaining}
        className={isLowTime ? "bg-red-200" : ""}
      />
    </div>
  );
}
