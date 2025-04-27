"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import type { SectionFormValues } from "./schema";
import { SectionForm } from "./section-form";

interface SectionDialogProps {
  organizationId: number;
  onSectionAdded: (section: SectionFormValues) => void;
}

export const SectionDialog = ({
  onSectionAdded,
  organizationId,
}: SectionDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(data: SectionFormValues) {
    onSectionAdded(data);
    setIsOpen(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button type="button" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Course Section</SheetTitle>
          <SheetDescription>
            Create a new section for this course with assigned professors and
            students.
          </SheetDescription>
        </SheetHeader>

        <div className="p-4">
          <SectionForm
            organizationId={organizationId}
            onSubmit={handleSubmit}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
