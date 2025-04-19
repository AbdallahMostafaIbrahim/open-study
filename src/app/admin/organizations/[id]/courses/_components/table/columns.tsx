"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "~/trpc/react";

export type Course = RouterOutputs["admin"]["courses"]["get"][number];

export const columns: ColumnDef<Course>[] = [
  {
    header: "Name",
    accessorFn: (row) => row.name,
  },
  {
    header: "Description",
    accessorFn: (row) => row.description,
  },
  {
    header: "Sections",
    accessorFn: (row) => row._count.sections,
  },
];
