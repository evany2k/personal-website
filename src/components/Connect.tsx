"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import CopyEmailButton from "@/components/CopyEmailButton";
import { siteConfig } from "@/data/siteConfig";

export default function Connect() {
  const [displayedEmail, setDisplayedEmail] = useState("");

  return (
    <div className="flex flex-col gap-4 my-8">
      <div className="flex flex-wrap items-center gap-4">
        {/* Reusable Primary Copy Email Button */}
        <CopyEmailButton
          variant="primary"
          onCopy={setDisplayedEmail}
        />

        {/* LinkedIn: Professional Link using an embedded native SVG logo */}
        <a
          href={siteConfig.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 border border-stone-300 bg-white rounded-lg hover:bg-stone-50 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 font-medium text-stone-700 hover:text-[#0077B5]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="shrink-0"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.667zM7.119 7.556a2.052 2.052 0 110-4.103 2.052 2.052 0 010 4.103zM8.895 20.452H5.341V9h3.554v11.452z" />
          </svg>

          <span>LinkedIn</span>
          <ExternalLink size={14} className="opacity-50" />
        </a>
      </div>

      {/* Safe Display Area */}
      <div className="text-sm text-gray-600 h-6">
        {displayedEmail ? (
          <p>
            Email address: <span className="font-mono font-bold text-black">{displayedEmail}</span>
          </p>
        ) : (
          <p>Clicking copy will also reveal the address here.</p>
        )}
      </div>
    </div>
  );
}