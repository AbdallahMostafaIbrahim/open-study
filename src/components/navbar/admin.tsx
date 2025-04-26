"use client";
import { SidebarTrigger, useSidebar } from "~/components/ui/sidebar";
import { NAME } from "~/lib/constants";
import { cn } from "~/lib/utils";

export function AdminNavbar() {
  const { open, isMobile } = useSidebar();

  return (
    <div className="flex h-12 w-full items-center border-b px-3">
      {(!open || isMobile) && (
        <>
          <SidebarTrigger />
          <div className="w-3"></div>
        </>
      )}
      <h1
        className={cn(
          "text-xl font-bold opacity-80 transition-all duration-300 ease-in-out",
        )}
      >
        {NAME} Admin
      </h1>
    </div>
  );
}
