import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 glass-button active:scale-95 touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-smooth",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 transition-smooth",
        outline:
          "border-2 border-input bg-background/80 hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-smooth",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 transition-smooth",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 transition-smooth",
        link: "text-primary underline-offset-4 hover:underline active:text-primary/80 transition-smooth",
        space: "bg-gradient-space text-white hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-300",
        cosmic: "bg-gradient-cosmic text-foreground border-2 border-primary/20 hover:border-primary/40 hover:shadow-cosmic active:border-primary/60 transition-all duration-300",
        gold: "bg-gradient-gold text-accent-foreground hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-300",
        purchase: "purchase-button text-white font-semibold hover:text-white shadow-lg",
      },
      size: {
        default: "h-12 px-6 py-3 text-base md:h-10 md:px-4 md:py-2 md:text-sm",
        sm: "h-10 px-4 py-2 text-sm md:h-9 md:px-3 md:rounded-md",
        lg: "h-14 px-8 py-4 text-lg md:h-11 md:px-8 md:text-base",
        icon: "h-12 w-12 md:h-10 md:w-10",
        mobile: "h-14 px-8 py-4 text-lg rounded-lg",
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
