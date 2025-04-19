import "~/styles/globals.css";

import { type Metadata } from "next";

import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { auth } from "~/server/auth";
import { cookies } from "next/headers";
import { SIDEBAR_COOKIE } from "~/lib/constants";
import { AdminSidebar } from "../../components/sidebar/admin";

export const metadata: Metadata = {
  title: "Admin | Openstudy",
  description: "AI Powered LMS",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user.admin) return redirect("/auth/sign-in");

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE)?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
