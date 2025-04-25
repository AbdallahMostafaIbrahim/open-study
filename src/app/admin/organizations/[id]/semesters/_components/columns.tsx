"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "~/trpc/react";

export type Semester = RouterOutputs["admin"]["semesters"]["get"][number];

export const columns: ColumnDef<Semester>[] = [
  {
    header: "Name",
    accessorFn: (row) => row.name,
  },
  {
    header: "Starts At",
    accessorFn: (row) => row.startDate?.toLocaleDateString(),
  },
  {
    header: "Ends At",
    accessorFn: (row) => row.endDate?.toLocaleDateString(),
  },
  {
    header: "Sections",
    accessorFn: (row) => row._count.sections,
  },
];
