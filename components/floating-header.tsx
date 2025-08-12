"use client"

import { cn } from "@/lib/utils"
import { IconMenu2, IconX } from "@tabler/icons-react"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import React, { useState } from "react"

interface NavbarProps {
  children: React.ReactNode
  className?: string
}

interface NavBodyProps {
  children: React.ReactNode
  className?: string
  visible?: boolean
}

interface NavItemsProps {
  items: {
    name: string
    link: string
  }[]
  className?: string
  onItemClick?: () => void
}

interface MobileNavProps {
  children: React.ReactNode
  className?: string
  visible?: boolean
}

interface MobileNavHeaderProps {
  children: React.ReactNode
  className?: string
}

interface MobileNavMenuProps {
  children: React.ReactNode
  className?: string
  isOpen: boolean
  onClose: () => void
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState<boolean>(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  })

  return (
    <motion.div className={cn("fixed inset-x-0 top-0 z-40 w-full px-6", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ visible?: boolean }>, { visible })
          : child,
      )}
    </motion.div>
  )
}

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" : "none",
        width: visible ? "70%" : "100%",
        y: visible ? 8 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-6xl flex-row items-center justify-between self-start rounded-lg bg-transparent px-6 py-3 lg:flex",
        visible && "bg-white/95 border border-gray-200",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null)
  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "flex flex-1 flex-row items-center justify-center space-x-1 text-sm font-medium text-gray-600 transition duration-200",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-3 py-2 text-gray-600 hover:text-black transition-colors"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div layoutId="hovered" className="absolute inset-0 h-full w-full rounded-md bg-gray-100" />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  )
}

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" : "none",
        width: visible ? "95%" : "100%",
        paddingRight: visible ? "16px" : "0px",
        paddingLeft: visible ? "16px" : "0px",
        borderRadius: visible ? "8px" : "0px",
        y: visible ? 8 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-1rem)] flex-col items-center justify-between bg-transparent px-4 py-3 lg:hidden",
        visible && "bg-white/95 border border-gray-200",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => {
  return <div className={cn("flex w-full flex-row items-center justify-between", className)}>{children}</div>
}

export const MobileNavMenu = ({ children, className, isOpen, onClose }: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-2 rounded-lg bg-white border border-gray-200 px-4 py-6 shadow-lg",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) => {
  return (
    <button onClick={onClick} className="p-1">
      {isOpen ? <IconX className="h-5 w-5 text-black" /> : <IconMenu2 className="h-5 w-5 text-black" />}
    </button>
  )
}

export default function FloatingHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "How it works", link: "#how-it-works" },
    { name: "Pricing", link: "#pricing" },
    { name: "Examples", link: "#examples" },
  ]

  return (
    <Navbar>
      <NavBody>
        {/* Logo */}
        <div className="flex items-center">
          <a href="#" className="text-xl font-bold text-black">
            BringBack
          </a>
        </div>

        {/* Navigation Items */}
        <NavItems items={navItems} />

        {/* CTA Button */}
        <div className="flex items-center">
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
            Try Now
          </button>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <div className="flex items-center">
            <a href="#" className="text-xl font-bold text-black">
              BringBack
            </a>
          </div>
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className="w-full px-2 py-2 text-gray-600 hover:text-black transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <button className="w-full bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors mt-2">
            Try Now
          </button>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}
