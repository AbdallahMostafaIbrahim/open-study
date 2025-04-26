import "~/styles/globals.css";

import { type Metadata } from "next";

import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { auth, signOut } from "~/server/auth";
import { cookies } from "next/headers";
import { NAME, SIDEBAR_COOKIE } from "~/lib/constants";
import { StudentSidebar } from "~/components/sidebar/student";
import { StudentNavbar } from "~/components/navbar/student";

export const metadata: Metadata = {
  title: NAME,
  description: "AI Powered LMS",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function StudentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user) return redirect("/auth/sign-in");

  if (!session.user.student) {
    // If the user is not a student, they are either a professor or an admin.
    // Redirect them to the appropriate page.
    if (session.user.admin) {
      return redirect("/admin");
    } else if (session.user.professor) {
      return redirect("/professor");
    } else {
      // Maybe log the user out if they are neither a student, professor, nor admin.
      // This is a fallback case and should not happen if the auth system is working correctly.
      return await signOut({ redirectTo: "/auth/sign-in" });
    }
  }

  const cookieStore = await cookies();
  const defaultOpen =
    cookieStore.get(SIDEBAR_COOKIE)?.value === undefined ||
    cookieStore.get(SIDEBAR_COOKIE)?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <StudentSidebar />
      <SidebarInset>
        <StudentNavbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
