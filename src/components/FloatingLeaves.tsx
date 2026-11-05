import React, { useMemo } from 'react';

/** Tea-leaf icon (Google Material Symbols) used for the floating animation. */
const LeafIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
    <path d="M12,22q-1.82-0.23-3.63-0.99q-1.8-0.76-3.21-2.19t-2.29-3.6T2,10V9H3Q4.28,9 5.63,9.32T8.15,10.3q0.3-2.15 1.36-4.41T12,2q1.43,1.63 2.49,3.89t1.36,4.41q1.18-0.65 2.52-0.97Q19.73,9 21,9h1v1q0,3.05-0.88,5.23t-2.29,3.6t-3.2,2.19T12,22Zm-0.05-2.05q-0.28-4.15-2.46-6.28T4.05,11.05q0.28,4.28 2.54,6.38q2.26,2.1 5.36,2.52ZM12,13.6q0.38-0.55 0.91-1.14q0.54-0.59 1.04-1.01q-0.05-1.43-0.56-2.97T12,5.45q-0.88,1.48-1.39,3.03t-0.56,2.97q0.5,0.43 1.05,1.01T12,13.6Zm1.95,5.9q0.92-0.3 1.92-0.88t1.86-1.56t1.48-2.46t0.74-3.55q-2.35,0.35-4.13,1.56T13.1,15.7q0.3,0.8 0.51,1.75t0.34,2.05ZM12,13.6Zm1.95,5.9Zm-2,0.45ZM13.1,15.7ZM12,22Z" />
  </svg>
);

const COLORS = ['#8ea67a', '#a9c08f', '#ffdf93', '#8ea67a', '#b8efc9'];

/**
 * Tea leaves drifting slowly upward across a section (decorative).
 * Place inside a `relative overflow-hidden` parent. Motion is switched off for
 * visitors who ask their device for reduced motion (see .leaf-float in index.css).
 */
export const FloatingLeaves: React.FC<{ count?: number }> = ({ count = 14 }) => {
  // Fixed pseudo-random layout so leaves don't jump around on re-render.
  const leaves = useMemo(() => {
    let seed = 7;
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: count }, (_, i) => ({
      left: (i / count) * 100 + rand() * (100 / count),
      size: 10 + Math.round(rand() * 12),
      duration: 24 + rand() * 18,
      delay: -rand() * 42, // negative = already mid-flight on page load
      drift: Math.round((rand() - 0.5) * 120),
      spin: Math.round((rand() - 0.5) * 360),
      opacity: 0.25 + rand() * 0.4,
      color: COLORS[i % COLORS.length],
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {leaves.map((l, i) => (
        <span
          key={i}
          className="leaf-float absolute bottom-0"
          style={
            {
              left: `${l.left}%`,
              animationDuration: `${l.duration}s`,
              animationDelay: `${l.delay}s`,
              '--leaf-drift': `${l.drift}px`,
              '--leaf-spin': `${l.spin}deg`,
              '--leaf-opacity': l.opacity,
            } as React.CSSProperties
          }
        >
          <LeafIcon size={l.size} color={l.color} />
        </span>
      ))}
    </div>
  );
};
