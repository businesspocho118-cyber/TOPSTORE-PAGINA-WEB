'use client'

import { motion, useInView, type Variants } from "framer-motion"
import { useRef } from "react"

interface TimelineContentProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  as?: string
  animationNum?: number
  customVariants?: Record<string, unknown>
  timelineRef?: React.RefObject<HTMLElement | null>
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
}

export function TimelineContent({
  children,
  className,
  style,
  as: Tag = "div",
  animationNum = 0,
  customVariants,
  timelineRef,
}: TimelineContentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(timelineRef || ref, { once: true, amount: 0.15 })

  const variants = (customVariants || defaultVariants) as Variants

  const MotionTag = motion[Tag as keyof typeof motion] as React.ComponentType<{
    children?: React.ReactNode
    className?: string
    style?: React.CSSProperties
    custom?: number
    initial?: string
    animate?: string
    variants?: Variants
    ref?: React.Ref<unknown>
  }>

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={style}
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </MotionTag>
  )
}