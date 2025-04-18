"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "~/trpc/react";

export type Organization =
  RouterOutputs["admin"]["organizations"]["get"][number];

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "contactEmail",
    header: "Contact Email",
  },
  {
    accessorKey: "_count",
    header: "Users",
    cell: ({ row }) => row.original._count.students,
  },
];
