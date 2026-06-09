"use client";

import { FloatingPathsBackground } from "@/components/floating-paths";

export default function FloatingPathsTopstore({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'var(--color-ink)' }}>
      <FloatingPathsBackground position={1} className="text-gold-deep/30">
        {children}
      </FloatingPathsBackground>
    </div>
  );
}
