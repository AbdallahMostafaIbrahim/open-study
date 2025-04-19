import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Bot, Calendar, Home, LibraryBig, Settings } from "lucide-react";
import Link from "next/link";
import { auth } from "~/server/auth";
import { MySidebarHeader } from "./common/header";
import { MySidebarFooter } from "./common/footer";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: LibraryBig,
  },
  {
    title: "Chatbot",
    url: "/chat",
    icon: Bot,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export async function StudentSidebar() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <Sidebar collapsible="icon">
      <MySidebarHeader defaultRole="student" user={session.user} />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <MySidebarFooter user={session.user} />
    </Sidebar>
  );
}
