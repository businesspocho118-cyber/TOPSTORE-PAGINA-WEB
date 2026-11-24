'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

export interface FlowSectionProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  style = {},
  children,
  'aria-label': ariaLabel,
}) => (
  <div
    data-flow-section
    aria-label={ariaLabel}
    className={cx('relative w-full', className)}
    style={style}
  >
    {children}
  </div>
);

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  'aria-label': ariaLabel = 'Story scroll',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: number | undefined;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 120);
    };

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => refresh())
        : null;
    observer?.observe(document.body);
    window.addEventListener('load', refresh);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      window.removeEventListener('load', refresh);
    };
  }, []);

  useGSAP(
    () => {
      ScrollTrigger.refresh();
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx('w-full overflow-x-clip', className)}
    >
      {children}
    </div>
  );
};

export default FlowArt;
