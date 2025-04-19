"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "~/trpc/react";

export type Professor = RouterOutputs["admin"]["professors"]["get"][number];

export const columns: ColumnDef<Professor>[] = [
  {
    header: "Name",
    accessorFn: (row) => row.user.name,
  },
  {
    header: "Email",
    accessorFn: (row) => row.user.email,
  },
  {
    header: "Courses",
    accessorFn: (row) => row._count.courses,
  },
];
