import { Hammer, Home, School, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "~/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { auth } from "~/server/auth";
import { SidebarDropdown } from "./sidebar-dropdown";
import { RoleSwitcher } from "~/components/role-switcher";
import { cookies } from "next/headers";
import type { Role } from "~/lib/types";
import type { Session } from "next-auth";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Organizations",
    url: "/admin/organizations",
    icon: School,
  },
  // {
  //   title: "Admins",
  //   url: "/settings",
  //   icon: Settings,
  // },
];

function roles(user: Session["user"]) {
  const r: Role[] = [];
  if (user.admin) r.push("admin");
  if (user.professor) r.push("professor");
  if (user.student) r.push("student");
  return r;
}

export async function AdminSidebar() {
  const session = await auth();
  if (!session?.user) return null;

  const username = session.user.name || "User";

  const cookieStore = await cookies();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 px-2 pt-4">
            <Logo className="fill-primary" />
            <h1 className="text-2xl font-bold opacity-80">Openstudy</h1>
          </SidebarMenuItem>
          <div className="h-2"></div>
          <RoleSwitcher defaultRole={"admin"} roles={roles(session.user)} />
        </SidebarMenu>
      </SidebarHeader>

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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarDropdown username={username} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
