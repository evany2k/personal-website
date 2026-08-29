import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Avatar Chat",
  description: "Chat with Evan Yatrou's interactive AI avatar to explore his background, software projects, and technical skills.",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
