"use client";

import React, { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { NavLink } from '@/types';
import Link from 'next/link';

const NAV_LINKS: NavLink[] = [
  { label: 'Features', href: '#benefits' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'FAQ', href: '#faqs' },
];

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full py-3 px-4 sm:px-8 flex items-center justify-between z-50 max-w-[1320px] mx-auto backdrop-blur-md transition-all duration-300">

      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer select-none">
        <div className="relative">
          {/* Abstract logo shape */}
          <div className="flex items-center justify-center bg-brand-black w-8 h-8 rounded-lg text-white">
            <Sparkles size={16} fill="currentColor" />
          </div>
        </div>
        <span className="text-2xl font-extrabold tracking-tight">BringBack</span>
      </div>

      {/* Desktop Navigation - Pill Shape */}
      <div className="hidden lg:flex items-center bg-brand-gray/80 backdrop-blur-sm px-2 py-2 rounded-full border border-black/5 shadow-sm">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-white rounded-full transition-all duration-200"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Desktop CTA */}
      <div className="hidden lg:flex">
        <Link href="/dashboard">
          <button className="group flex items-center gap-3 bg-brand-black text-white pl-5 pr-2 py-2 rounded-full hover:scale-105 transition-transform duration-200 shadow-lg">
            <span className="text-sm font-medium">Restore Photo</span>
            <div className="bg-brand-orange rounded-full p-2 text-white group-hover:bg-white group-hover:text-brand-orange transition-colors">
              <Sparkles size={14} fill="currentColor" />
            </div>
          </button>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-brand-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 flex flex-col gap-4 lg:hidden origin-top animate-in fade-in slide-in-from-top-5 duration-200">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100 last:border-0"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link href="/dashboard">
            <button className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white py-4 rounded-full font-bold mt-2">
              Restore Photo <Sparkles size={18} />
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};