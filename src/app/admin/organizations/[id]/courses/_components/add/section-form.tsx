"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Check, ChevronsUpDown, User } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import {
  sectionSchema,
  type SectionFormValues,
  type SelectedPerson,
} from "./schema";
import { api } from "~/trpc/react";

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

interface SectionFormProps {
  organizationId: number;
  onSubmit: (data: SectionFormValues) => void;
}

export const SectionForm = ({ onSubmit, organizationId }: SectionFormProps) => {
  // Fetch available professors, students, and semesters
  const { data: professors = [] } =
    api.admin.professors.get.useQuery(organizationId);
  const { data: students = [] } =
    api.admin.students.get.useQuery(organizationId);
  const { data: semesters = [] } =
    api.admin.semesters.get.useQuery(organizationId);

  const [selectedProfessors, setSelectedProfessors] = useState<
    SelectedPerson[]
  >([]);
  const [selectedStudents, setSelectedStudents] = useState<SelectedPerson[]>(
    [],
  );
  const [professorOpen, setProfessorOpen] = useState(false);
  const [studentOpen, setStudentOpen] = useState(false);

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      sectionNumber: "",
      professors: [],
      students: [],
    },
  });

  function handleProfessorSelection(professorId: string) {
    const prof = professors?.find((p) => p.user.id === professorId);
    if (prof && !selectedProfessors.some((p) => p.id === professorId)) {
      setSelectedProfessors([
        ...selectedProfessors,
        {
          id: professorId,
          name: prof.user.name || prof.user.email,
          imageUrl: prof.user.image || "",
        },
      ]);
      const currentProfessors = form.getValues().professors || [];
      form.setValue("professors", [...currentProfessors, professorId]);
      setProfessorOpen(false);
    }
  }

  function handleStudentSelection(studentId: string) {
    const student = students?.find((s) => s.user.id === studentId);
    if (student && !selectedStudents.some((s) => s.id === studentId)) {
      setSelectedStudents([
        ...selectedStudents,
        {
          id: studentId,
          name: student.user.name || student.user.email,
          imageUrl: student.user.image || "",
        },
      ]);
      const currentStudents = form.getValues().students || [];
      form.setValue("students", [...currentStudents, studentId]);
      setStudentOpen(false);
    }
  }

  function removeProfessor(professorId: string) {
    setSelectedProfessors(
      selectedProfessors.filter((p) => p.id !== professorId),
    );
    const currentProfessors = form.getValues().professors;
    form.setValue(
      "professors",
      currentProfessors.filter((id) => id !== professorId),
    );
  }

  function removeStudent(studentId: string) {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== studentId));
    const currentStudents = form.getValues().students;
    form.setValue(
      "students",
      currentStudents.filter((id) => id !== studentId),
    );
  }

  function handleSubmit() {
    if (form.formState.isValid) {
      onSubmit(form.getValues());
    }
  }

  return (
    <Form {...form}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sectionNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Number</FormLabel>
                <FormControl>
                  <Input placeholder="001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="semesterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={
                    field.value ? field.value.toString() : undefined
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a semester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {semesters
                      ?.filter(
                        (semester) =>
                          (!semester.startDate ||
                            new Date(semester.startDate) <= new Date()) &&
                          (!semester.endDate ||
                            new Date(semester.endDate) >= new Date()),
                      )
                      .map((semester) => (
                        <SelectItem
                          key={semester.id}
                          value={semester.id.toString()}
                        >
                          {semester.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Professors</FormLabel>
          <Popover modal open={professorOpen} onOpenChange={setProfessorOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={professorOpen}
                className="w-full justify-between"
              >
                Select professors...
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent removePortal className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search professors..." />
                <CommandEmpty>No professor found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {professors?.map((professor) => (
                    <CommandItem
                      key={professor.user.id}
                      value={professor.user.id}
                      onSelect={() =>
                        handleProfessorSelection(professor.user.id)
                      }
                      disabled={selectedProfessors.some(
                        (p) => p.id === professor.user.id,
                      )}
                      className={cn(
                        "flex items-center gap-2",
                        selectedProfessors.some(
                          (p) => p.id === professor.user.id,
                        ) && "opacity-50",
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={professor.user.image || ""}
                          alt={professor.user.name || professor.user.email}
                        />
                        <AvatarFallback className="text-foreground/70">
                          {getInitials(
                            professor.user.name || professor.user.email,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1">
                        {professor.user.name || professor.user.email}
                      </span>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedProfessors.some(
                            (p) => p.id === professor.user.id,
                          )
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <ScrollArea className="mb-2 h-40 rounded-md border p-2">
            <div className="space-y-1">
              {selectedProfessors.map((prof) => (
                <div
                  key={prof.id}
                  className="hover:bg-muted/50 flex items-center justify-between rounded-md px-2 py-1"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={prof.imageUrl} alt={prof.name} />
                      <AvatarFallback className="text-foreground/70">
                        {getInitials(prof.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{prof.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => removeProfessor(prof.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-2">
          <FormLabel>Students</FormLabel>
          <Popover modal open={studentOpen} onOpenChange={setStudentOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={studentOpen}
                className="w-full justify-between"
              >
                Select students...
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent removePortal className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search students..." />
                <CommandEmpty>No student found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {students?.map((student) => (
                    <CommandItem
                      key={student.user.id}
                      value={student.user.id}
                      onSelect={() => handleStudentSelection(student.user.id)}
                      disabled={selectedStudents.some(
                        (s) => s.id === student.user.id,
                      )}
                      className={cn(
                        "flex items-center gap-2",
                        selectedStudents.some(
                          (s) => s.id === student.user.id,
                        ) && "opacity-50",
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={student.user.image || ""}
                          alt={student.user.name || student.user.email}
                        />
                        <AvatarFallback className="text-foreground/70">
                          {getInitials(student.user.name || student.user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1">
                        {student.user.name || student.user.email}
                      </span>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedStudents.some((s) => s.id === student.user.id)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <ScrollArea className="mb-2 h-40 rounded-md border p-2">
            <div className="space-y-1">
              {selectedStudents.map((student) => (
                <div
                  key={student.id}
                  className="hover:bg-muted/50 flex items-center justify-between rounded-md px-2 py-1"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.imageUrl} alt={student.name} />
                      <AvatarFallback className="text-foreground/70">
                        {getInitials(student.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{student.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => removeStudent(student.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-4">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!form.formState.isValid}
        >
          Add Section
        </Button>
      </div>
    </Form>
  );
};
