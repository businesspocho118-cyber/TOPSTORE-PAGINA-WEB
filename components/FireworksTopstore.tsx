"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number; y: number; color: string;
  velocity: { x: number; y: number };
  alpha: number; lifetime: number; size: number;
}

interface Firework {
  x: number; y: number; color: string;
  velocity: { x: number; y: number };
  particles: Particle[]; exploded: boolean;
  timeToExplode: number;
}

const COLORS = [
  "#b88a2d", // gold
  "#7a5614", // gold-deep
  "#efe3c4", // champagne
  "#d4a84b", // warm gold
  "#c49530", // mid gold
  "#e8d5a3", // light champagne
  "#8a6a24", // dark gold
];

export default function FireworksTopstore({ children, className }: { children: React.ReactNode; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastFireworkTimeRef = useRef<number>(Date.now());

  const createFirework = (x?: number, y?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const startX = x || Math.random() * canvas.width;
    const startY = canvas.height;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
    const velocity = 6 + Math.random() * 4;
    const target = y || canvas.height * (0.1 + Math.random() * 0.4);

    fireworksRef.current.push({
      x: startX, y: startY, color,
      velocity: { x: Math.sin(angle) * velocity, y: -Math.cos(angle) * velocity * 1.5 },
      particles: [], exploded: false, timeToExplode: target,
    });
  };

  const explodeFirework = (firework: Firework) => {
    const count = 60 + Math.floor(Math.random() * 40);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const vel = Math.random() * 5 + 1;
      firework.particles.push({
        x: firework.x, y: firework.y, color: firework.color,
        velocity: { x: Math.cos(angle) * vel * (0.5 + Math.random()), y: Math.sin(angle) * vel * (0.5 + Math.random()) },
        alpha: 1, lifetime: Math.random() * 30 + 30, size: Math.random() * 3 + 1,
      });
    }
  };

  const updateAndDraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = "rgba(12, 10, 9, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fws = fireworksRef.current;
    for (let i = 0; i < fws.length; i++) {
      const fw = fws[i];
      if (!fw.exploded) {
        fw.x += fw.velocity.x;
        fw.y += fw.velocity.y;
        fw.velocity.y += 0.1;
        ctx.beginPath();
        ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = fw.color;
        ctx.fill();
        if (fw.y <= fw.timeToExplode || fw.velocity.y >= 0 || fw.x < 0 || fw.x > canvas.width) {
          if (fw.y > 0 && fw.y < canvas.height) explodeFirework(fw);
          fw.exploded = true;
        }
      } else {
        for (let j = 0; j < fw.particles.length; j++) {
          const p = fw.particles[j];
          p.x += p.velocity.x;
          p.y += p.velocity.y;
          p.velocity.y += 0.05;
          p.alpha -= 1 / p.lifetime;
          if (p.alpha <= 0.1) { fw.particles.splice(j, 1); j--; continue; }
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        if (fw.particles.length === 0) { fws.splice(i, 1); i--; }
      }
    }

    const now = Date.now();
    if (now - lastFireworkTimeRef.current > 1000 + Math.random() * 2000) {
      const n = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < n; i++) createFirework();
      lastFireworkTimeRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(updateAndDraw);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const updateSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    updateSize();
    window.addEventListener("resize", updateSize);
    for (let i = 0; i < 3; i++) createFirework();
    lastFireworkTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(updateAndDraw);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
