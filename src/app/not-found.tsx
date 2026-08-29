import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, FolderGit2, User, FileText, Bot, ArrowUpRight } from 'lucide-react';
import NotFoundActions from '@/components/NotFoundActions';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The requested page could not be found. Explore other sections of Evan Yatrou\'s portfolio.',
};

export default function NotFound() {
  const quickLinks = [
    {
      title: 'Projects',
      description: 'Explore web applications, tools, and data systems.',
      href: '/projects',
      icon: FolderGit2,
    },
    {
      title: 'About Me',
      description: 'Background combining Environmental & Computer Science.',
      href: '/about',
      icon: User,
    },
    {
      title: 'Resume',
      description: 'Experience, technical skills, and academic background.',
      href: '/resume',
      icon: FileText,
    },
    {
      title: "Talk to Evan's AI",
      description: 'Interactive assistant trained on my background and projects.',
      href: '/chat',
      icon: Bot,
      highlight: true,
    },
  ];

  return (
    <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative overflow-hidden min-h-[calc(100vh-8rem)]">
      <div className="max-w-2xl mx-auto w-full text-center space-y-6">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-stone-300 bg-white text-stone-700 text-xs sm:text-sm font-mono rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <span>STATUS: 404 // ROUTE_NOT_FOUND</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-xs mb-2">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-800 text-pretty">
            Lost in the Digital Wilderness
          </h1>

          <p className="text-stone-600 text-base sm:text-lg max-w-lg mx-auto leading-relaxed text-pretty">
            The page or resource you are looking for has either migrated habitats, been refactored, or never existed in this repository.
          </p>
        </div>

        {/* Primary & Back Actions */}
        <NotFoundActions />

        {/* Helpful Destinations Grid */}
        <div className="pt-8 border-t border-stone-200 text-left">
          <p className="text-xs font-mono uppercase tracking-wider text-stone-500 text-center mb-4">
            Popular Destinations
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group p-4 rounded-xl border transition-all duration-200 bg-white shadow-xs hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${
                    item.highlight
                      ? 'border-emerald-300 hover:border-emerald-600 bg-emerald-50/40'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 rounded-lg ${
                          item.highlight
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-700 group-hover:text-emerald-700 group-hover:bg-emerald-50'
                        } transition-colors`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed pl-0.5">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
