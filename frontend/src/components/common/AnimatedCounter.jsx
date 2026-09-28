import { useEffect, useState } from 'react';

/**
 * AnimatedCounter component
 * Animates a numeric value from 0 to target value with easing
 */
export default function AnimatedCounter({ 
  value = 0, 
  duration = 1200, 
  prefix = '', 
  suffix = '', 
  decimals = 0 
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const target = Number(value) || 0;
    
    if (target === 0) {
      setCount(0);
      return;
    }

    let animationFrame;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutCubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(easeOut * target);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const formatted = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.round(count).toLocaleString();

  return <span>{prefix}{formatted}{suffix}</span>;
}
