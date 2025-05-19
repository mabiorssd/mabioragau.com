
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-green-500/20 text-green-400 hover:bg-green-500/30 shadow-[0_0_10px_rgba(0,255,0,0.15)]",
        secondary:
          "border-transparent bg-secondary/80 text-secondary-foreground hover:bg-secondary/60",
        destructive:
          "border-transparent bg-destructive/80 text-destructive-foreground hover:bg-destructive/60",
        outline: "text-foreground border-green-500/30",
        cyber: "border border-green-500/40 bg-black text-green-400 shadow-[0_0_8px_rgba(0,255,0,0.2)]"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
