import Link from "next/link";
import type { Metadata } from "next";
import Connect from "@/components/Connect";

export const metadata: Metadata = {
  title: "About Me",
  description: "Learn about Evan Yatrou's background in Environmental Science at McGill University, transition to Computer Science, and software engineering interests.",
};


export default function About() {
  return (
    <main className="flex-1 flex flex-col px-6 lg:px-20 py-12 md:py-24">
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-800 mb-8 text-pretty">
          About Me
        </h1>

        <div className="space-y-6 text-lg text-stone-600 leading-relaxed text-pretty">
          <p>
            My journey into software engineering is a bit unconventional. I started with a
            <strong className="text-stone-800 font-medium"> B.Sc. in Environmental Science</strong> at McGill University,
            where I developed a deep appreciation for complex systems, data analysis, and the natural world.
          </p>

          <p>
            Driven by a desire to build scalable solutions and automate complex problems, I pursued a
            <strong className="text-stone-800 font-medium"> Graduate Diploma in Computer Science</strong>.
            This transition allowed me to blend the scientific rigor and analytical thinking from my
            environmental background with the creative problem-solving of software development.
          </p>

          <p>
            Today, I focus on improving my software engineering abilities by building projects that I am passionate about.
            I'm also excited and optimistic for a future enhanced by Artificial Intelligence tools and agents. I'm always trying to learn about
            new technologies that will bring positive value to our society.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Let's connect</h2>
          <p className="text-lg text-stone-600 leading-relaxed mb-8">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
          </p>

          <Connect />

          <Link
            href="/projects"
            className="inline-flex px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 focus:ring-2 focus:ring-emerald-800 focus:ring-offset-2"
          >
            View My Projects
          </Link>
        </div>
      </div>
    </main>
  );
}