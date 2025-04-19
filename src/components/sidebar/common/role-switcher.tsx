"use client";

import * as React from "react";
import { Check, ChevronsUpDown, GalleryVerticalEnd, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import type { Role } from "~/lib/types";
import { useRouter } from "next/navigation";

const roleToLink: Record<Role, string> = {
  admin: "/admin",
  professor: "/professor",
  student: "/student",
};

export function RoleSwitcher({
  roles,
  defaultRole,
}: {
  roles: Role[];
  defaultRole: Role;
}) {
  const [selectedRole, setSelectedRole] = React.useState(defaultRole);
  const router = useRouter();

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground space-x-1"
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <User className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">Interface</span>
              <span className="capitalize">{selectedRole}</span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width]"
          align="start"
        >
          {roles.map((role) => (
            <DropdownMenuItem
              key={role}
              onSelect={() => {
                setSelectedRole(role);
                router.push(roleToLink[role]);
              }}
              className="capitalize"
            >
              {role} {role === selectedRole && <Check className="ml-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
