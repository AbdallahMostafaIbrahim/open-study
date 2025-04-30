"use client";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "~/components/ui/button";
import { FormControl } from "~/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { api } from "~/trpc/react";

export function GroupSelector({
  sectionId,
  field,
}: {
  sectionId: number;
  field: { value?: string; onChange: (value?: string) => void };
}) {
  const [openCombobox, setOpenCombobox] = useState(false);
  const { data: existingGroups, isLoading: isLoadingGroups } =
    api.professor.courses.material.groups.useQuery({
      sectionId,
    });

  return (
    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="w-full justify-between"
          >
            {field.value ? field.value : "Select or create a group..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Search or create group..."
            onValueChange={(value) => {
              if (
                value &&
                existingGroups?.filter(
                  (g) => g.group?.toLowerCase() === value.toLowerCase(),
                ).length === 0
              ) {
                field.onChange(value);
              }
            }}
          />
          <CommandList>
            <CommandEmpty>
              <div className="px-2 py-3 text-sm">
                <p>No existing group found.</p>
                <p className="text-muted-foreground">
                  Press enter to create &quot;{field.value}
                  &quot;
                </p>
              </div>
            </CommandEmpty>
            <CommandGroup heading="Existing Groups">
              <CommandItem
                value=""
                onSelect={() => {
                  field.onChange("");
                  setOpenCombobox(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    field.value === "" ? "opacity-100" : "opacity-0",
                  )}
                />
                Ungrouped
              </CommandItem>
              {existingGroups
                ?.filter((group) => group.group !== null)
                .map(({ group }) => (
                  <CommandItem
                    key={group}
                    value={group!}
                    onSelect={() => {
                      field.onChange(group!);
                      setOpenCombobox(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        field.value === group ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {group}
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Create New Group">
              {field.value &&
                !existingGroups?.some((g) => g.group === field.value) && (
                  <CommandItem
                    onSelect={() => {
                      setOpenCombobox(false);
                    }}
                  >
                    Create &quot;{field.value}&quot;
                  </CommandItem>
                )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
