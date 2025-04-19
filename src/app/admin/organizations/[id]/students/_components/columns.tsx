"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Pen, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { RouterOutputs } from "~/trpc/react";
import { RemoveButton } from "./remove";

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
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled size="icon" className="h-8 w-8">
            <Pen />
          </Button>
          <RemoveButton id={row.original.user.id} />
        </div>
      );
    },
  },
];
