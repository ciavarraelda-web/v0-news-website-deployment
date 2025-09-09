"use client"

import * as React from "react"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
}

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        variant === "destructive"
          ? "border-red-500 bg-red-50 text-red-800"
          : "border-blue-500 bg-blue-50 text-blue-800"
      } ${className}`}
      {...props}
    />
  )
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={`font-medium leading-none tracking-tight ${className}`} {...props} />
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={`text-sm ${className}`} {...props} />
}
