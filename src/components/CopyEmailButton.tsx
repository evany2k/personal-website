'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';

interface CopyEmailButtonProps {
  email?: string;
  variant?: 'primary' | 'compact';
  onCopy?: (email: string) => void;
  className?: string;
}

export default function CopyEmailButton({
  email = siteConfig.email,
  variant = 'compact',
  onCopy,
  className = '',
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Fallback for non-HTTPS or unsupported browsers
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    setCopied(true);
    if (onCopy) onCopy(email);
    setTimeout(() => setCopied(false), 2200);
  };

  // 1. Primary / Prominent Variant (e.g. for About Page / Connect Section)
  if (variant === 'primary') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy email address ${email} to clipboard`}
        className={`flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 ${className}`}
      >
        {copied ? (
          <>
            <Check size={18} className="shrink-0" />
            <span>Copied to Clipboard!</span>
          </>
        ) : (
          <>
            <Copy size={18} className="shrink-0" />
            <span>Copy Email Address</span>
          </>
        )}
      </button>
    );
  }

  // 2. Compact / Utility Variant (e.g. for Footer)
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy email address ${email} to clipboard`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-700/40 ${
        copied
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          : 'bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-200/80'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check size={13} className="text-emerald-700 shrink-0" />
          <span className="font-semibold text-emerald-800">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={13} className="text-stone-400 shrink-0" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
