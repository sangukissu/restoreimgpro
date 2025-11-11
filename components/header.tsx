"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type React from "react"
import { Plus } from "lucide-react"
import { FramerButton } from "@/components/ui/framer-button"


interface NavbarProps {
  children: React.ReactNode
  className?: string
}

interface NavBodyProps {
  children: React.ReactNode
  className?: string
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
}

export const Navbar = ({ children, className }: NavbarProps) => {
  return <motion.div className={cn("fixed inset-x-0 top-0 z-60 w-full pt-4", className)}>{children}</motion.div>
}

export const NavBody = ({ children, className }: NavBodyProps) => {
  return (
    <motion.div
      className={cn(
        // **FIXED: Clean White Translucency and Subtle Border**
        "shadow-sm shadow-zinc-500/10 relative z-[60] mx-auto max-w-4xl flex-row items-center justify-between self-start rounded-full bg-white/50 px-4 py-3 hidden backdrop-blur-lg lg:flex ",
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
        // **FIXED: Rich, Warm Charcoal Text Color (text-gray-900 is darker and more professional)**
        "flex flex-1 flex-row items-center justify-center space-x-1 text-gray-900 transition duration-200",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          // **FIXED: Link Color and Hover effect**
          className="relative px-3 py-2 text-gray-900 text-md font-semibold hover:text-black transition-colors"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            // **FIXED: Clean, Light Hover Background**
            <motion.div layoutId="hovered" className="absolute inset-0 h-full w-full rounded-md bg-gray-100/70" />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  )
}

export const MobileNav = ({ children, className }: MobileNavProps) => {
  return (
    <motion.div
      className={cn(
        // **FIXED: Mobile Clean White Translucency**
        "shadow-zinc-500/10 bg-white/50 relative z-50 mx-auto flex w-[95%] max-w-[calc(100vw-1rem)] flex-col items-center justify-between rounded-full backdrop-blur-lg py-3 px-4 lg:hidden shadow-sm",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export default function Header() {
  const navItems = [
    { name: "Features", link: "/#features" },
    { name: "How it works", link: "/#how-it-works" },
    { name: "Pricing", link: "/pricing" },
  ]

  return (
    <Navbar>
      <NavBody>
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2">
            {/* Logo is assumed to work well against a white background */}
            <Image 
              src="/header-logo.webp" 
              alt="BringBack Logo" 
              width={80} 
              height={36} 
              className="w-36 h-9"
              style={{ width: 'auto' }}
            />
          </a>
        </div>

        {/* Navigation Items */}
        <NavItems items={navItems} />

        {/* CTA Button */}
        <div className="flex items-center">
          <Link href="/dashboard">
             {/* CTA: Keeping the color dark for high contrast. If your primary brand color is a rich, warm tone, use it here instead of black. */}
             <FramerButton variant="primary" icon={<Plus />} className="text-sm py-1 group relative overflow-hidden pr-10 pl-4" iconClassName="w-6 h-6">
            Restore Now
          </FramerButton>
            </Link>
        </div>
      </NavBody>

      <MobileNav>
        <div className="flex w-full items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <Image 
                src="/header-logo.webp" 
                alt="BringBack Logo" 
                width={80} 
                height={36} 
                className="w-36 h-9"
                style={{ width: 'auto' }}
              />
            </a>
          </div>
          
          {/* CTA Button */}
          <div className="flex items-center">
            <Link href="/dashboard">
              <FramerButton variant="primary" icon={<Plus />} className="text-sm py-1 group overflow-hidden pr-10 pl-4" iconClassName="w-6 h-6">
                Restore Now
              </FramerButton>
            </Link>
          </div>
        </div>
      </MobileNav>
    </Navbar>
  )
}