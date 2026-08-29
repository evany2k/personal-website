'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFoundActions() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-sm sm:text-base rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:ring-offset-2"
      >
        <Home className="w-4 h-4" />
        <span>Return Home</span>
      </Link>

      <button
        type="button"
        onClick={handleGoBack}
        className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-medium text-sm sm:text-base rounded-lg transition-all duration-200 ease-in-out shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-stone-600" />
        <span>Go Back</span>
      </button>
    </div>
  );
}
