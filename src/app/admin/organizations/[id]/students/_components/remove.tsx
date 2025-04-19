"use client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

export const RemoveButton = ({ id }: { id: string }) => {
  const [open, setIsOpen] = useState(false);
  const router = useRouter();
  const { isPending, mutate } = api.admin.students.remove.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this student?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            student from the system.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              mutate(id);
            }}
            disabled={isPending}
          >
            Submit
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              setIsOpen(false);
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
