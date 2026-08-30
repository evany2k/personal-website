/**
 * ============================================================================
 * PROJECT MEDIA DIMENSIONS GUIDE:
 * ============================================================================
 * 1. Side Banner (`imageUrlSideBanner`):
 *    - recommended 1200 x 1200 image
 * 
 * 2. Display / Preview Picture & Video (`imageUrlPreview` in Modal):
 *    - Rendered Container: 16:9 widescreen (`aspect-video`), max width ~608px in modal
 *    - Scaling: `object-cover object-top`
 *    - Recommended Aspect Ratio: 16:9 (Landscape)
 *    - Recommended Asset Resolution: 1920 x 1080 px or 1280 x 720 px
 *    - Supported formats: Images (.png, .jpg, .webp) or Videos (.mp4, .webm)
 * ============================================================================
 */

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  detailedDescription?: string;
  category: 'web' | 'java' | 'data-science' | 'research';
  subcategory?: string;
  categoryLabel: string;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  date: string;
  highlights?: string[];
  imageGradient?: string;
  /**
   * Project card visual side banner image:
   * - Desktop: 288px wide (`md:w-72`) x card height (~260-300px) -> ~1:1 Square
   * - Mobile: 100% width x 192px height (`h-48`)
   * - Recommended size: 600x600px or 800x800px (1:1 Square)
   * - Avoid 3:4 portrait (600x800) as object-cover will crop ~25% off the bottom.
   */
  imageUrlSideBanner?: string | null;
  /**
   * Modal preview media (image or video):
   * - Rendered: 16:9 widescreen (`aspect-video`), up to 608x342px
   * - Recommended size: 1920x1080px or 1280x720px (16:9)
   * - Formats: .png, .jpg, .webp, .mp4, .webm
   */
  imageUrlPreview?: string | null;
}

import { siteConfig } from "@/data/siteConfig";

export const projectsData: Project[] = [
  {
    id: "personal-portfolio-site",
    title: "Personal Website",
    subtitle: "Full-stack personal website built with Next.js 16, React 19, and Tailwind CSS",
    description: "A fast, modern developer portfolio showcasing my software projects, educational journey, and my personal AI assistant.",
    detailedDescription: "Built to bridge scientific rigor with modern web engineering. Features server-rendered Next.js 16 pages, Tailwind CSS v4 styling, custom component architecture, and interactive data views.",
    category: "web",
    categoryLabel: "Web Engineering",
    techStack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/evany2k/personal-website",
    liveUrl: siteConfig.siteUrl,
    featured: true,
    date: "2026",
    highlights: [
      "Built with Next.js App Router & React 19 for fast server rendering",
      "Tailwind CSS v4 custom theme with soft earthy aesthetics",
      "Interactive component design with responsive cards and modals",
      "AI Avatar chat page for visitor engagement"
    ],
    imageGradient: "from-emerald-800 to-stone-800",
    imageUrlSideBanner: "/images/portfolio-website-side-4.png",
    imageUrlPreview: "/images/portfolio-website-image4.png"
  },
  {
    id: "java-snake-game",
    title: "Java Snake Game",
    subtitle: "Classic arcade game demonstrating Object-Oriented Programming (OOP)",
    description: "An interactive desktop Snake game engineered in Java using OOP principles, dynamic game loop state, collision detection, maze layout choices, and a MySQL database for statistics tracking.",
    detailedDescription: "Developed to demonstrate core Object-Oriented Software Design patterns. Features custom frame rendering, event-driven keyboard controls, real-time collision logic, dynamic speed scaling, obstacle layout choices and a cloud-based MySQL database for statistics tracking across accounts.",
    category: "java",
    categoryLabel: "Java & Desktop",
    techStack: ["Java", "MySQL", "OOP Design", "Java Swing / AWT", "Event Handling", "Algorithms"],
    githubUrl: null,
    featured: true,
    date: "2025",
    highlights: [
      "Engineered object-oriented state management for Snake, Grid, Obstacles and Food objects",
      "Implemented smooth game loop using Java Swing Timer events",
      "Custom gameplay collision detection algorithm for wall boundary, obstacle, food and self collisions",
      "Cloud based MySQL database for statistics tracking across accounts",
      "Signup/Login system with password hashing and session management",
      "Multiple difficulty levels with adjustable speed settings",
      "Retro Arcade styling"
    ],
    imageGradient: "from-amber-900 to-emerald-950",
    imageUrlSideBanner: "/images/snake-side-1.png",
    imageUrlPreview: "/images/Snake-preview.mp4"
  },
  {
    id: "VLA-Research",
    title: "Vision-Language-Action Model Research",
    subtitle: "Explored the generalization capabilities of multi-modal robotics models",
    description: "Researched and compared the outcomes of current state-of-the-art VLA models on autonomous robotic tasks",
    detailedDescription: "This project involves a comprehensive literature review and synthesis of recent advancements in Vision-Language-Action (VLA) models. The research focuses on evaluating how these models generalize to new tasks, their robustness in the face of rare events, and their performance in real-world robotic applications. By analyzing key datasets, model architectures, and evaluation metrics, we aim to identify current trends, persistent challenges, and promising directions for future research in autonomous embodied AI.",
    category: "research",
    categoryLabel: "Research Paper",
    techStack: ["Literature Review"],
    githubUrl: null,
    featured: true,
    date: "2025",
    highlights: [
      "Quantified the impact on generalization capabilities, performance and robustness in edge-case scenarios",
      "Identified trends and patterns in the research",
      "Identified strengths and weaknesses of different VLA models",
    ],
    imageGradient: "from-slate-800 to-slate-900",
    imageUrlSideBanner: "/images/vla-side-test-1.png",
    imageUrlPreview: "/images/VLA-preview-1.mp4"
  },
  {
    id: "environmental-carbon-estimator",
    title: "Carbon Emissions Research",
    subtitle: "Estimating McGill's Scope 3 Category 1 Carbon Emissions",
    description: "Analyzed university purchase data to estimate and gain insights on carbon emissions and reduction strategies",
    detailedDescription: "This project involved a comprehensive analysis of McGill University's Scope 3 Category 1 (Purchased Goods and Services) carbon emissions. The research focused on cleaning and categorizing extensive purchase data, utilizing the Climatiq API to estimate emissions factors, and producing actionable insights to support the university's sustainability goals. The methodology followed the Greenhouse Gas (GHG) Protocol standards, ensuring accuracy and comparability with industry benchmarks. Findings were synthesized into a formal research report with recommendations for emission reduction strategies.",
    category: "data-science",
    categoryLabel: "Data & Environment",
    techStack: ["Excel", "Climatiq", "PowerPoint"],
    githubUrl: null,
    featured: true,
    date: "2024",
    highlights: [
      "Categorized and cleaned university purchase data",
      "Used Climatiq's API of emission factors to estimate and calculate carbon emissions",
      "Gained insights on emissions and produced a research report on findings and potential strategies",
      "Followed the GHG Protocol Methodology for Scope 3 Category 1 emissions",
    ],
    imageGradient: "from-teal-800 to-slate-900",
    imageUrlSideBanner: "/images/carb-side-1.jpg",
    imageUrlPreview: "/images/carb-preview-1.png"
  }
];
