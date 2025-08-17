"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { IconMenu2, IconX } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react"
import { useState } from "react"

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
  return <motion.div className={cn("fixed inset-x-0 top-0 z-60 w-full pt-2", className)}>{children}</motion.div>
}

export const NavBody = ({ children, className }: NavBodyProps) => {
  return (
    <motion.div
      className={cn(
        "relative z-[60] mx-auto w-[70%] max-w-6xl flex-row items-center justify-between self-start rounded-lg bg-white/95 border border-gray-200 px-6 py-3 hidden backdrop-blur-lg lg:flex",
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

export const MobileNav = ({ children, className }: MobileNavProps) => {
  return (
    <motion.div
      className={cn(
        "relative z-50 mx-auto flex w-[95%] max-w-[calc(100vw-1rem)] flex-col items-center justify-between bg-white/95 border border-gray-200 rounded-lg backdrop-blur-lg py-3 px-4 lg:hidden",
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
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-2 rounded-lg bg-white border border-gray-200 px-4 py-6",
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

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "How it works", link: "#how-it-works" },
    { name: "Pricing", link: "#pricing" },
    { name: "Examples", link: "#showcase" },
  ]

  return (
    <Navbar>
      <NavBody>
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

        {/* Navigation Items */}
        <NavItems items={navItems} />

        {/* CTA Button */}
        <div className="flex items-center">
          <Link href="/dashboard">
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
            Restore Now
          </button>
          </Link>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
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
          <Link href="/login">
          <button className="w-full bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors mt-2">
            Sign In
          </button>
            </Link>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}
