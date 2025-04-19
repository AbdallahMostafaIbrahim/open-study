import { Logo } from "~/components/logo";
import {
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { RoleSwitcher } from "~/components/sidebar/common/role-switcher";
import { roles } from "~/lib/utils";
import type { Session } from "next-auth";
import { SidebarDropdown } from "./dropdown";

export async function MySidebarFooter({ user }: { user: Session["user"] }) {
  const username = user.name || "User";
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarDropdown username={username} />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
