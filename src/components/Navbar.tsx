'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when navigating to another route
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/resume', label: 'Resume' },
    { href: '/projects', label: 'Projects' },
  ];

  return (
    <nav className="w-full bg-[#F9F8F6]/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-stone-800 hover:text-emerald-700 transition-colors tracking-tight"
            onClick={() => setIsOpen(false)}
          >
            Evan_Yatrou
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${isActive ? 'text-emerald-700 font-semibold' : 'hover:text-emerald-700'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* AI Chat Link */}
            <Link
              href="/chat"
              className={`hover:text-emerald-700 transition-all flex items-center gap-2 border border-stone-300 px-3 py-1 rounded-full bg-white shadow-sm hover:border-emerald-600 ${pathname === '/chat' ? 'ring-2 ring-emerald-600/30 border-emerald-600 text-emerald-800 font-semibold' : ''
                }`}
            >
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
              Talk to Evan's AI
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-2 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-700/40 transition-colors cursor-pointer touch-manipulation relative z-10"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#F9F8F6] px-4 pt-3 pb-5 space-y-2 shadow-lg relative z-50">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-stone-700 hover:bg-stone-200/50 hover:text-emerald-700'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-200/70">
            <Link
              href="/chat"
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center justify-center gap-2 border border-stone-300 py-2.5 rounded-xl bg-white shadow-sm text-sm font-medium text-stone-800 hover:text-emerald-700 hover:border-emerald-600 transition-all ${pathname === '/chat' ? 'ring-2 ring-emerald-600/30 border-emerald-600 text-emerald-800 font-semibold' : ''
                }`}
            >
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
              Talk to Evan's AI
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}