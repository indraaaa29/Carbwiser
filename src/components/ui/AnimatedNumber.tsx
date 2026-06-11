import { useState, useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
}

export const AnimatedNumber = ({ value, duration = 1500, suffix = "" }: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span aria-live="polite" aria-atomic="true">
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
};
