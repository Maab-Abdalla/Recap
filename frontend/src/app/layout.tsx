import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Fraunces echoes the serif character of the Recap wordmark
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Recap",
  description:
    "Turn any meeting transcript into structured tasks and summaries",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans min-h-screen bg-milkyway">
        {/* Grid-paper backdrop — the Recap "notebook" surface */}
        <div
          className="fixed inset-0 -z-10 bg-repeat opacity-90"
          style={{
            backgroundImage: "url(/brand/grid-bg.png)",
            backgroundSize: "1100px",
          }}
          aria-hidden
        />
        <div
          className="fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -10%, rgba(208,227,255,0.35), transparent 60%)",
          }}
          aria-hidden
        />
        {children}
      </body>
    </html>
  );
}
