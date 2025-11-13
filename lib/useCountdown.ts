import { clear } from "console";
import { useEffect, useState } from "react";

export default function useCountdown(targetDate: string, targetTime?: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const raceTime = new Date(
        '${targetDate}T${targetTime || "14:00:00"}Z'
      ).getTime();
      const distance = raceTime - now;

      if (distance <= 0) {
        setTimeLeft("Race in progress or finished");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft("${days}d ${hours}h ${minutes}m ${seconds}s");
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  return timeLeft;
}
