import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import HolyLoader from "holy-loader";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "~/trpc/react";
import { NAME } from "~/lib/constants";

export const metadata: Metadata = {
  title: NAME,
  description: "AI Powered LMS",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <HolyLoader color="linear-gradient(to right,rgb(101, 40, 158),rgb(171, 81, 255))" />
      <body className="dark">
        <Toaster />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
