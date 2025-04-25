"use client";

import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent } from "~/components/ui/card";
import type { SectionFormValues } from "./schema";
import { api } from "~/trpc/react";

interface SectionTableProps {
  sections: SectionFormValues[];
  organizationId: number;
  onRemoveSection: (index: number) => void;
}

export const SectionTable = ({
  sections,
  organizationId,
  onRemoveSection,
}: SectionTableProps) => {
  const { data: semesters } = api.admin.semesters.get.useQuery(organizationId);
  if (sections.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-8 text-center">
        <p className="text-gray-500">No sections added yet</p>
        <p className="text-sm text-gray-400">
          Click "Add Section" to create a new section
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Section</TableHead>
          <TableHead>Semester</TableHead>
          <TableHead>Professors</TableHead>
          <TableHead>Students</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sections.map((section, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {section.sectionNumber}
            </TableCell>
            <TableCell>
              {semesters?.find((s) => s.id === section.semesterId)?.name ||
                "Unknown"}
            </TableCell>
            <TableCell>{section.professors.length} professor(s)</TableCell>
            <TableCell>{section.students.length} student(s)</TableCell>
            <TableCell>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveSection(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
