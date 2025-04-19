import { Logo } from "~/components/logo";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { RoleSwitcher } from "./role-switcher";
import { roles } from "~/lib/utils";
import type { Session } from "next-auth";

export async function MySidebarHeader({ user }: { user: Session["user"] }) {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center gap-2 px-2 pt-4">
          <Logo className="fill-primary" />
          <h1 className="text-2xl font-bold opacity-80">Openstudy</h1>
        </SidebarMenuItem>
        <div className="h-2"></div>
        <RoleSwitcher defaultRole={"admin"} roles={roles(user)} />
      </SidebarMenu>
    </SidebarHeader>
  );
}
