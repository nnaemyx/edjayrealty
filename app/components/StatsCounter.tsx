"use client";

import { useEffect, useState, useRef } from "react";
import { formatNumber } from "../lib/utils";

interface StatsCounterProps {
  target: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export default function StatsCounter({
  target,
  label,
  prefix = "",
  suffix = "",
  duration = 2000,
}: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = target;
    const totalFrames = Math.min(Math.floor(duration / 16), 120); // roughly 60fps
    const increment = end / totalFrames;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      start = Math.min(start + increment, end);
      setCount(Math.floor(start));

      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  // Format count dynamically based on value
  const displayValue = () => {
    if (count >= 1_000_000_000) {
      return `${(count / 1_000_000_000).toFixed(1)}B`;
    }
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(0)}M`;
    }
    if (count >= 1_000) {
      return `${(count / 1_000).toFixed(0)}K`;
    }
    return count.toString();
  };

  return (
    <div ref={elementRef} className="flex flex-col items-center justify-center p-6 text-center">
      <div className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] text-primary mb-2 flex items-center justify-center">
        <span>{prefix}</span>
        <span>{displayValue()}</span>
        <span className="text-accent">{suffix}</span>
      </div>
      <p className="text-text-muted text-sm font-semibold tracking-wider uppercase">
        {label}
      </p>
    </div>
  );
}
