"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Course Section</DialogTitle>
          <DialogDescription>
            Create a new section for this course with assigned professors and
            students.
          </DialogDescription>
        </DialogHeader>

        <SectionForm organizationId={organizationId} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};
