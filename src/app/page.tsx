import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Portfolio of Evan Yatrou — Software developer combining environmental science and computer science to build thoughtful software solutions.",
};
export default function Home() {
  return (
    <main className="flex-1 flex flex-col justify-center px-6 lg:px-20 relative overflow-hidden py-12 md:py-16 min-h-[calc(100vh-4rem)]">

      <div className="max-w-5xl mx-auto w-full">

        {/* Badge: Unique Background */}
        <div
          className="inline-block px-5 py-1.5 mb-6 border border-stone-300 bg-white text-stone-700 text-xs sm:text-sm font-mono rounded-full shadow-sm"
          aria-label="Educational background"
        >
          B.Sc. Environmental Science ➔ Graduate Diploma in Computer Science
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-stone-800 mb-6 leading-[1.2] md:leading-[1.1] text-pretty">
          Engineering a better future <br className="hidden md:block" />
          through <span className="text-emerald-800">Science</span>{" "}
          <span className="md:whitespace-nowrap">
            and{" "}
            <span className="font-mono text-stone-700 text-4xl md:text-6xl bg-stone-100 border border-stone-300 shadow-inner px-2 py-0 md:px-3 md:py-1 rounded-lg ml-1 inline-block transform -translate-y-1">
              {"{ code }"}
            </span>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-stone-600 mb-10 max-w-[60ch] leading-relaxed text-pretty">
          Hi, I'm Evan, a software developer with a unique perspective. I combine scientific rigor and analytical thinking with modern software engineering to build tech that matters.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href="/about"
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 focus:ring-2 focus:ring-emerald-800 focus:ring-offset-2"
          >
            Learn More About Me
          </Link>
          <Link
            href="/resume"
            className="px-6 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-medium rounded-lg transition-all duration-200 ease-in-out shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 focus:ring-2 focus:ring-emerald-800 focus:ring-offset-2"
          >
            My Resume
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-medium rounded-lg transition-all duration-200 ease-in-out shadow-sm hover:-translate-y-0.5 active:scale-95 focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
          >
            View My Projects
          </Link>
          <Link
            href="/chat"
            className="px-6 py-3 text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-medium rounded-lg transition-all duration-200 ease-in-out flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
          >
            Talk To Evan's AI
          </Link>
        </div>

      </div>
    </main>
  );
}