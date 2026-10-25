import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Chant" },
  robots: { index: false, follow: false },
  openGraph: { title: "Chant", siteName: "Chant" },
};

export default function ChantLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen min-h-dvh bg-cream text-ink">{children}</div>;
}