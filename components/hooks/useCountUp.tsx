import { useState, useEffect } from "react";

export function useCountUp(
  end: number,
  duration: number = 1000,
  start?: number,
) {
  const [count, setCount] = useState(start || 0);

  useEffect(() => {
    if (count === end) return;

    const step = Math.ceil(end / (duration / 100)); // Update every 50ms
    const timer = setTimeout(() => {
      setCount((prevCount) => {
        const nextCount = prevCount + step;
        return nextCount > end ? end : nextCount;
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [count, end, duration]);

  return count;
}
