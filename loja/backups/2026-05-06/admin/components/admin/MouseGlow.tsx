import { useEffect, useRef, useState, type ReactNode } from "react";

interface MouseGlowProps {
  children: ReactNode;
}

export function MouseGlow({ children }: MouseGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Mouse-following glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute z-0 transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 200,
            top: mousePosition.y - 200,
            width: 400,
            height: 400,
            background: `radial-gradient(circle, oklch(0.62 0.15 280 / 0.06) 0%, transparent 70%)`,
            borderRadius: '50%',
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
