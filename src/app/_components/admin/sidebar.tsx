import { Hammer, Home, Settings } from "lucide-react";
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
} from "~/components/ui/sidebar";
import { auth } from "~/server/auth";
import { SidebarDropdown } from "./sidebar-dropdown";

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
    icon: Hammer,
  },
  {
    title: "Admins",
    url: "/settings",
    icon: Settings,
  },
];

export async function AdminSidebar() {
  const session = await auth();
  const username = session?.user.name || "User";
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 px-2 pt-4">
            <Logo className="fill-primary" />
            <h1 className="text-2xl font-bold opacity-80">Openstudy</h1>
          </SidebarMenuItem>
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
