import type { Metadata } from "next";
import ProjectsClient from "@/components/ProjectsClient";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore software engineering, systems programming, and environmental data science projects built by Evan Yatrou.",
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}