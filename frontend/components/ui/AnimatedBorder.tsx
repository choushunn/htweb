"use client";

import { useEffect, useRef } from "react";

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
  /** Reverse direction (counter-clockwise) */
  reverse?: boolean;
  /** Degrees per frame (~60fps). Default: 0.5 (full rotation ≈ 12s) */
  speed?: number;
}

export default function AnimatedBorder({
  children,
  className = "",
  reverse = false,
  speed = 0.5,
}: AnimatedBorderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);

  useEffect(() => {
    let rafId: number;
    const dir = reverse ? -speed : speed;
    const animate = () => {
      angleRef.current = (angleRef.current + dir + 360) % 360;
      if (ref.current) {
        ref.current.style.setProperty("--border-deg", `${angleRef.current}deg`);
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [reverse, speed]);

  return (
    <div
      ref={ref}
      className={`border-box ${reverse ? "border-box--alt" : ""} ${className}`}
    >
      <span className="border-content">{children}</span>
    </div>
  );
}
