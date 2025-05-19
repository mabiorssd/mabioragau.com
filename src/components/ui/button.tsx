
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary/80 text-primary-foreground hover:bg-primary/60 backdrop-blur-sm shadow-[0_0_10px_rgba(0,255,0,0.2)]",
        destructive:
          "bg-destructive/80 text-destructive-foreground hover:bg-destructive/60",
        outline:
          "border border-green-500/30 bg-transparent hover:bg-green-500/10 text-green-400",
        secondary:
          "bg-secondary/80 text-secondary-foreground hover:bg-secondary/60 backdrop-blur-sm",
        ghost: "hover:bg-green-900/20 hover:text-green-400 text-green-500",
        link: "text-primary underline-offset-4 hover:underline",
        cyber: "border border-green-500/40 bg-black/70 text-green-400 hover:bg-green-900/30 shadow-[0_0_10px_rgba(0,255,0,0.15)] cyber-glow relative overflow-hidden after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-gradient-to-r after:from-transparent after:via-green-500/10 after:to-transparent after:transform after:-translate-x-full hover:after:translate-x-full after:transition-all after:duration-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
