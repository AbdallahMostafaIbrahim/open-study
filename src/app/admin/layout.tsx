import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { auth } from "~/server/auth";
import { AdminSidebar } from "../_components/admin/sidebar";

export const metadata: Metadata = {
  title: "Admin | Openstudy",
  description: "AI Powered LMS",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user.admin) return redirect("/auth/sign-in");

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
