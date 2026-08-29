import Link from 'next/link';
import { ExternalLink, Mail, MapPin, FileDown } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import ScrollToTop from '@/components/ScrollToTop';
import CopyEmailButton from '@/components/CopyEmailButton';
import { siteConfig } from '@/data/siteConfig';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/resume', label: 'Resume' },
    { href: '/projects', label: 'Projects' },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      href: siteConfig.socials.github,
      icon: FaGithub,
    },
    {
      name: 'LinkedIn',
      href: siteConfig.socials.linkedin,
      icon: FaLinkedin,
    },
  ];

  return (
    <footer
      role="contentinfo"
      className="w-full border-t border-stone-200 bg-[#F9F8F6] text-stone-800 transition-colors"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-8">
          {/* Column 1: Brand & Background (Span 5 on MD) */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="text-xl font-bold text-stone-900 hover:text-emerald-700 transition-colors tracking-tight inline-block"
            >
              {siteConfig.title}
            </Link>
            <p className="text-sm text-stone-600 leading-relaxed max-w-sm">
              {siteConfig.tagline}
            </p>

            {/* Location & Availability Badges */}
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2.5 pt-1 text-xs text-stone-600">
              <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-2.5 py-1 rounded-full shadow-xs">
                <MapPin size={13} className="text-emerald-700 shrink-0" />
                <span>{siteConfig.location}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-2.5 py-1 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                <span className="text-stone-700 font-medium">{siteConfig.status}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Navigation (Span 3 on MD) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Navigation
            </h3>
            <nav aria-label="Footer Navigation" className="flex flex-col space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-stone-600 hover:text-emerald-700 font-medium transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
              {/* Highlighted AI Chat Link */}
              <Link
                href="/chat"
                className="text-stone-700 hover:text-emerald-700 font-medium transition-colors inline-flex items-center gap-1.5 w-fit group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                <span>Talk to Evan's AI</span>
              </Link>
            </nav>
          </div>

          {/* Column 3: Connect & Social (Span 4 on MD) */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex flex-col space-y-2.5 text-sm">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-stone-600 hover:text-emerald-700 transition-colors py-0.5 group w-full max-w-[200px]"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Icon className="text-stone-500 group-hover:text-emerald-700 transition-colors text-base" />
                      <span>{item.name}</span>
                    </span>
                    <ExternalLink size={13} className="text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}

              {/* Resume Download Link */}
              <a
                href={siteConfig.resume.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                download={siteConfig.resume.downloadName}
                className="flex items-center justify-between text-stone-600 hover:text-emerald-700 transition-colors py-0.5 group w-full max-w-[200px]"
              >
                <span className="flex items-center gap-2 font-medium">
                  <FileDown className="text-stone-500 group-hover:text-emerald-700 transition-colors text-base" size={16} />
                  <span>Resume (PDF)</span>
                </span>
                <span className="text-[11px] text-stone-400 font-normal">Download</span>
              </a>

              {/* Email Section with 1-click copy */}
              <div className="pt-2 border-t border-stone-200/80">
                <div className="flex items-center justify-between gap-2 max-w-[260px]">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-center gap-1.5 text-stone-600 hover:text-emerald-700 font-medium text-xs truncate transition-colors"
                    title="Send an email to Evan"
                  >
                    <Mail size={14} className="shrink-0 text-stone-500" />
                    <span>{siteConfig.email}</span>
                  </a>
                  <CopyEmailButton email={siteConfig.email} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Colophon & Scroll-to-top */}
        <div className="pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {currentYear} {siteConfig.name}. All rights reserved.</span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span>Built with Next.js 16, React 19 & Tailwind CSS</span>
          </div>

          <div>
            <ScrollToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
