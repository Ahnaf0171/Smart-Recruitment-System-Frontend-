import { useEffect, useState } from "react";

export function useCountUp(
  target: number,
  duration = 2000,
  startWhenVisible = false,
  isVisible = true
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (startWhenVisible && !isVisible) return;

    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [target, duration, startWhenVisible, isVisible]);

  return count;
}
