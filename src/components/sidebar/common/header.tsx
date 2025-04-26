import { Logo } from "~/components/logo";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "~/components/ui/sidebar";
import { RoleSwitcher } from "./role-switcher";
import { roles } from "~/lib/utils";
import type { Session } from "next-auth";
import type { Role } from "~/lib/types";
import { NAME } from "~/lib/constants";

export function MySidebarHeader({
  user,
  defaultRole,
}: {
  user: Session["user"];
  defaultRole: Role;
}) {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center justify-between px-2 pt-4">
          <div className="flex items-center gap-2">
            <Logo className="fill-primary" />
            <h1 className="text-xl font-bold opacity-80">{NAME}</h1>
          </div>
          <SidebarTrigger className="size-8" />
        </SidebarMenuItem>
        <div className="h-2"></div>
        <RoleSwitcher defaultRole={defaultRole} roles={roles(user)} />
      </SidebarMenu>
    </SidebarHeader>
  );
}
