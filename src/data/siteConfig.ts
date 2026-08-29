export const siteConfig = {
  name: "Evan Yatrou",
  title: "Evan_Yatrou",
  role: "Software Developer",
  tagline:
    "Software developer blending environmental science with modern computer science to engineer thoughtful, high-impact systems.",
  location: "Montreal, QC, Canada",
  status: "Available for opportunities",
  email: "evany2k@gmail.com",
  socials: {
    github: "https://github.com/evany2k",
    linkedin: "https://linkedin.com/in/evan-yatrou-1896b8267",
  },
  resume: {
    pdfPath: "/resume.pdf",
    downloadName: "Evan_Yatrou_Resume.pdf",
  },
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://evanyatrou.dev"),
};

export type SiteConfig = typeof siteConfig;
