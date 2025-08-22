import React from "react"
import { cn } from "@/lib/utils"

interface FramerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
  children: React.ReactNode
  icon?: React.ReactNode
  asChild?: boolean
  iconClassName?: string
}

const FramerButton = React.forwardRef<HTMLButtonElement, FramerButtonProps>(
  ({ className, variant = "primary", children, icon, asChild = false, iconClassName, ...props }, ref) => {
    const Comp = asChild ? "span" : "button"

    return (
      <Comp
        className={cn(
          // Base styles
          "font-inherit inline-flex items-center justify-center font-medium cursor-pointer tracking-wider overflow-hidden relative transition-all duration-300",
          // Primary variant
          variant === "primary" &&
            "bg-[#121212] text-white px-5 py-3 text-lg rounded-[0.6em] border-none h-[2.8em] pr-12 shadow-[inset_0_0_1.6em_-0.6em_#dbdbdb] hover:translate-x-[-0.05em] hover:translate-y-[-0.05em] active:translate-x-[0.05em] active:translate-y-[0.05em] active:shadow-[0.05em_0.05em_#000000]",
          // Secondary variant
          variant === "secondary" &&
            "bg-gradient-to-b from-[#1f5afe] to-[#0f4cf5] text-white px-5 py-3 text-lg rounded-[0.6em] border-none h-[2.8em] pr-12 shadow-[inset_0pt_4pt_3pt_-2pt_#386fff,_0pt_4pt_5pt_-3pt_#0009] hover:translate-x-[-0.05em] hover:translate-y-[-0.05em] active:translate-x-[0.05em] active:translate-y-[0.05em] active:shadow-[0.05em_0.05em_#4275e4]",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
        {icon && (
          <span
            className={cn(
              "ml-4 absolute flex items-center justify-center h-8 w-8 p-1 rounded-[0.5em] right-2 transition-all duration-300",
              variant === "primary" &&
                "bg-[#595959] shadow-[inset_0pt_-3pt_3pt_-2pt_#292929,_inset_0pt_3pt_3pt_-2pt_#717171,_0pt_2pt_2pt_-2pt_#0005,_0pt_0pt_0pt_2pt_#1d1d1d]",
              variant === "secondary" &&
                "bg-[#3e6eff] shadow-[inset_0pt_-3pt_3pt_-2pt_#1f54f0,_inset_0pt_3pt_3pt_-2pt_#658dff,_0pt_2pt_2pt_-2pt_#0005,_0pt_0pt_0pt_2pt_#0d47f0]",
              iconClassName,
            )}
          >
            {icon}
          </span>
        )}
      </Comp>
    )
  },
)
FramerButton.displayName = "FramerButton"

export { FramerButton }
