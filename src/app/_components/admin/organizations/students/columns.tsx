"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "~/trpc/react";

export type Student = RouterOutputs["admin"]["students"]["get"][number];

export const columns: ColumnDef<Student>[] = [
  {
    header: "Name",
    accessorFn: (row) => row.user.name,
  },
  {
    header: "Email",
    accessorFn: (row) => row.user.email,
  },
  {
    header: "Student ID",
    accessorFn: (row) => row.studentId,
  },
];
