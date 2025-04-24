import "~/styles/globals.css";

import { type Metadata } from "next";

import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { auth } from "~/server/auth";
import { cookies } from "next/headers";
import { SIDEBAR_COOKIE } from "~/lib/constants";
import { ProfessorSidebar } from "~/components/sidebar/professor";

export const metadata: Metadata = {
  title: "Professor | Openstudy",
  description: "AI Powered LMS",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function ProfessorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user) return redirect("/auth/sign-in");
  // if (!session?.user.professor) return redirect("/");

  const cookieStore = await cookies();
  const defaultOpen =
    cookieStore.get(SIDEBAR_COOKIE)?.value === undefined ||
    cookieStore.get(SIDEBAR_COOKIE)?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <ProfessorSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
