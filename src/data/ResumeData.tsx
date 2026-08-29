import { FaJava, FaReact, FaGitAlt } from "react-icons/fa";
import { PiFileSql } from "react-icons/pi";
import { SiCplusplus, SiTypescript } from "react-icons/si";

// -- Education Data ----------------------
export type EducationEntry = {
    id: string;
    degree: string;
    duration: string;
    school: string;
    logo: string;
    description: string;
    gpa?: string; // Optional: Some degrees might not need a GPA listed
    link?: string; // Optional: Some degrees might not have a link
};

export const educationData: EducationEntry[] = [
    {
        id: "concordia",
        degree: "Graduate Diploma in Computer Science",
        duration: "2025 - 2026",
        school: "Concordia University",
        logo: "/images/concordia-logo.png",
        description: `Advanced Programming (C++), 
      Data Structures and Algorithms (Java), 
      Files and Databases (SQL), 
      Tools and Techniques for SWE, 
      Operating Systems, 
      Computer Organization and Design.`,
        gpa: "4.15/4.30",
        link: "https://www.concordia.ca/academics/graduate/computer-science-diploma.html"
    },
    {
        id: "mcgill",
        degree: "Bachelor of Science in Environment - Biodiversity and Conservation Focus",
        duration: "2020 - 2023",
        school: "McGill University",
        logo: "/images/mcgill-logo.png",
        description: `Computer Programming for Life Sciences (Python), 
      Intro to Software Systems (C), 
      Environmental Research, 
      Intro to Geo-Information Science (GIS), 
      Methods in Biology (R), 
      and many more across Biological and Earth Sciences.`,
        gpa: "3.79/4.00",
        link: "https://www.mcgill.ca/environment/undergraduate-studies/undergraduate-programs/bscandbsc-ag-env-sc"
    }
];
// ---- End Education Data ----------------------

// --- Work Data -------------------------
export type ExperienceEntry = {
    id: string;
    title: string;
    company: string;
    duration: string;
    description: string[];
    link?: string;
}

export const experienceData: ExperienceEntry[] = [
    {
        id: "cellcarta",
        title: "Sample Reception Assistant",
        company: "CellCarta",
        duration: "2024 - Present",
        description: [
            "Ensure data integrity and end-to-end traceability for biological samples and reagents using Laboratory Information Management Systems (LIMS).",
            "Collaborate with scientists to support various research projects by preparing and processing reagents and materials required for testing within time-sensitive deadlines.",
            "Maintain strict adherence to Good Documentation Practices (GDP) and standard operating procedures (SOPs), ensuring compliance with regulatory requirements."
        ],
        link: "https://cellcarta.com/"
    },
    {
        id: "moosebawr",
        title: "Busser",
        company: "Moose Bawr",
        duration: "2021 - 2024",
        description: [
            "Provided exceptional guest experiences through attentive service and quick response to demands.",
            "Actively assisted team members through organized and efficient multitasking.",
            "Followed health and safety procedures to ensure the safety of guests and co-workers."
        ]
    }
];

// ---- END WORK DATA -----

// Official 2-color Python Logo Component
export function PythonLogo({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" >
            <path d="M63.04 4.08c-29.23 0-27.42 12.67-27.42 12.67l.03 13.12h27.85v3.94H24.23S4.08 31.54 4.08 61.12c0 29.57 17.58 28.48 17.58 28.48h10.51V74.34s-.57-17.58 17.29-17.58h29.7c0 0 16.71.27 16.71-16.14V19.78s2.26-15.7-33.03-15.7zm-14.8 8.87c2.59 0 4.69 2.1 4.69 4.69 0 2.59-2.1 4.69-4.69 4.69-2.59 0-4.69-2.1-4.69-4.69 0-2.59 2.1-4.69 4.69-4.69z" fill="#3776AB" />
            <path d="M64.96 123.92c29.23 0 27.42-12.67 27.42-12.67l-.03-13.12H64.5v-3.94h39.27s20.15 2.27 20.15-27.31c0-29.58-17.58-28.48-17.58-28.48H95.83v15.26s.57 17.58-17.29 17.58H48.84c0 0-16.71-.27-16.71 16.14v20.84s-2.26 15.7 33.03 15.7zm14.8-8.87c-2.59 0-4.69-2.1-4.69-4.69 0-2.59 2.1-4.69 4.69-4.69 2.59 0 4.69 2.1 4.69 4.69 0 2.59-2.1-4.69-4.69 4.69z" fill="#FFD43B" />
        </svg>
    );
}

// Skills data ---
export const skills = [
    { name: "Python", icon: <PythonLogo className="w-5 h-5" /> },
    { name: "C++", icon: <SiCplusplus className="text-[#00599C] text-xl" /> },
    { name: "Java", icon: <FaJava className="text-[#E76F51] text-xl" /> },
    { name: "SQL", icon: <PiFileSql className="text-[#336791] text-xl" /> },
    { name: "TypeScript", icon: <SiTypescript className="text-[#3178C6] text-xl" /> },
    { name: "React", icon: <FaReact className="text-[#00D8FF] text-xl" /> },
    { name: "Git", icon: <FaGitAlt className="text-[#F05032] text-xl" /> }
]