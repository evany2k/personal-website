'use client';

import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Scroll to top of page"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-emerald-800 bg-white hover:bg-stone-100 border border-stone-200 hover:border-emerald-300 rounded-lg shadow-xs hover:shadow transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
    >
      <span>Back to top</span>
      <ArrowUp
        size={13}
        className="text-stone-400 group-hover:text-emerald-700 group-hover:-translate-y-0.5 transition-transform duration-200"
      />
    </button>
  );
}
