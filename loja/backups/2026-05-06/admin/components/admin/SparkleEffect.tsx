import { useEffect, useRef, useState } from "react";

export function SparkleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sparkles, setSparkles] = useState<Array<{x: number, y: number, size: number, opacity: number, vx: number, vy: number}>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create initial sparkles
    const initialSparkles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));
    setSparkles(initialSparkles);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      initialSparkles.forEach((sparkle) => {
        sparkle.x += sparkle.vx;
        sparkle.y += sparkle.vy;

        if (sparkle.x < 0 || sparkle.x > canvas.width) sparkle.vx *= -1;
        if (sparkle.y < 0 || sparkle.y > canvas.height) sparkle.vy *= -1;

        // Draw sparkle
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.62 0.15 280 / ${sparkle.opacity})`;
        ctx.fill();

        // Draw cross lines for sparkle effect
        ctx.beginPath();
        ctx.moveTo(sparkle.x - sparkle.size * 2, sparkle.y);
        ctx.lineTo(sparkle.x + sparkle.size * 2, sparkle.y);
        ctx.moveTo(sparkle.x, sparkle.y - sparkle.size * 2);
        ctx.lineTo(sparkle.x, sparkle.y + sparkle.size * 2);
        ctx.strokeStyle = `oklch(0.62 0.15 280 / ${sparkle.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}
