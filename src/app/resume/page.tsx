import type { Metadata } from "next";
import { Download, Briefcase, GraduationCap, Code, User, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { educationData, experienceData, skills } from "@/data/ResumeData";

export const metadata: Metadata = {
  title: "Resume",
  description: "View Evan Yatrou's education, software engineering experience, technical skills, and coursework.",
};


export default function Resume() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 text-stone-800">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-stone-300 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 mb-2">Evan Yatrou</h1>
          <p className="text-lg text-emerald-800 font-medium">Software Developer</p>
        </div>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download="Evan_Yatrou_Resume.pdf"
          className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Download size={16} />
          Download PDF
        </a>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column (Main Content) */}
        <div className="md:col-span-2 space-y-10">
          {/* Education */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="text-emerald-700" size={24} />
              <h2 className="text-2xl font-bold text-stone-900">Education</h2>
            </div>

            <div className="space-y-12">
              {educationData.map((edu, index) => (
                <div key={edu.id} className="relative flex flex-col sm:flex-row items-start">

                  {/* logo container */}
                  <div className="flex-shrink-0 pt-1 mb-4 sm:mb-0 sm:absolute sm:-left-16 sm:top-0">
                    <Image
                      src={edu.logo}
                      alt={`${edu.school} Logo`}
                      width={48}
                      height={48}
                      className="object-contain"
                      priority={index === 0} // Only prioritize loading the first image
                    />
                  </div>

                  {/* text container */}
                  <div className="w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
                      <h3 className="text-lg font-bold text-stone-800">{edu.degree}</h3>
                      <span className="whitespace-nowrap shrink-0 text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full w-fit">{edu.duration}</span>
                    </div>
                    <p className="text-emerald-700 font-medium mb-2">{edu.school}</p>
                    <p className="text-stone-600 text-sm mb-1">
                      <strong className="font-semibold text-stone-900">Relevant Coursework: </strong>
                      {edu.description}
                    </p>
                    {edu.gpa && <p className="text-stone-600 text-sm font-bold mb-2">GPA: {edu.gpa}</p>}
                    {edu.link && (
                      <a
                        href={edu.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-stone-400 hover:text-emerald-600 underline underline-offset-2 transition-colors"
                      >
                        View Program Details
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Experience */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="text-emerald-700" size={24} />
              <h2 className="text-2xl font-bold text-stone-900">Experience</h2>
            </div>

            {/* Mapping Experience */}
            <div className="space-y-8">
              {experienceData.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
                    <h3 className="text-lg font-bold text-stone-800">{exp.title}</h3>
                    <span className="text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full w-fit">{exp.duration}</span>
                  </div>
                  <p className="text-emerald-700 font-medium mb-3">{exp.company}</p>
                  <ul className="list-disc list-outside ml-5 space-y-2 text-stone-600 text-sm leading-relaxed">
                    {exp.description.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                  {exp.link && (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-stone-400 hover:text-emerald-600 underline underline-offset-2 transition-colors"
                    >
                      View Company Website
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>


        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-10">
          {/* Profile Summary */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="text-emerald-700" size={20} />
              <h2 className="text-xl font-bold text-stone-900">Profile</h2>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed">
              Computer Science graduate (Graduate Diploma) with a background in Environmental Science (BSc) and industry experience in biopharmaceutical data systems.
              Proficient in Python, SQL, Java, and C++, with a strong track record of applying analytical problem-solving to complex datasets.
            </p>
          </section>

          {/* Skills Overview */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Code className="text-emerald-700" size={20} />
              <h2 className="text-xl font-bold text-stone-900">Core Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <div
                  key={skill.name}
                  className="flex flex-col items-center justify-center p-2 min-w-[4.25rem] min-h-[4.25rem] bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-lg hover:shadow-sm hover:bg-emerald-100/60 hover:border-emerald-300 transition-all text-center group"
                >
                  <span className="mb-1 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {skill.icon}
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-emerald-950">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}