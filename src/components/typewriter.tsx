import { useState, useEffect, useCallback } from "react";

type TypewriterProps = {
  phrases: string[];
  typingMs?: number;
  erasingMs?: number;
  pauseMs?: number;
  className?: string;
};

export function Typewriter({
  phrases,
  typingMs = 70,
  erasingMs = 35,
  pauseMs = 2200,
  className,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isErasing, setIsErasing] = useState(false);

  const current = phrases[index % phrases.length];

  const tick = useCallback(() => {
    if (!isErasing) {
      if (displayed.length < current.length) {
        setDisplayed(current.slice(0, displayed.length + 1));
      } else {
        setTimeout(() => setIsErasing(true), pauseMs);
        return;
      }
    } else {
      if (displayed.length > 0) {
        setDisplayed(displayed.slice(0, -1));
      } else {
        setIsErasing(false);
        setIndex((i) => (i + 1) % phrases.length);
      }
    }
  }, [displayed, isErasing, current, pauseMs, phrases.length, index]);

  useEffect(() => {
    const delay = isErasing ? erasingMs : typingMs;
    const timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
  }, [tick, isErasing, erasingMs, typingMs]);

  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse text-[#c6f135]">|</span>
    </span>
  );
}
