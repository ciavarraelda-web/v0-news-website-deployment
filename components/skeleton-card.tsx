"use client"
import { motion } from "framer-motion"

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-card/40 rounded-2xl p-4 ${className}`}>
      <div className="h-40 bg-muted rounded-md mb-4" />
      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
      <div className="h-3 bg-muted rounded w-1/2 mb-1" />
      <div className="h-3 bg-muted rounded w-1/3" />
    </div>
  )
}
