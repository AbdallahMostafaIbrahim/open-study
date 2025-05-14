import { Bot, Calendar, Home, LibraryBig, Settings } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { auth } from "~/server/auth";
import { MySidebarFooter } from "./common/footer";
import { MySidebarHeader } from "./common/header";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/professor",
    icon: Home,
  },
  {
    title: "Courses",
    url: "/professor/courses",
    icon: LibraryBig,
  },
  {
    title: "Calendar",
    url: "/professor/calendar",
    icon: Calendar,
    disabled: true,
  },
  {
    title: "Settings",
    url: "/professor/settings",
    icon: Settings,
    disabled: true,
  },
];

export async function ProfessorSidebar() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <Sidebar>
      <MySidebarHeader defaultRole="professor" user={session.user} />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={item.disabled ? "opacity-70" : ""}
                    asChild
                  >
                    {item.disabled ? (
                      <div>
                        <item.icon />
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
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
