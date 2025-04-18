"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export interface BreadcrumbItemType {
  label: string;
  href: string;
}

export interface CustomBreadcrumbProps {
  /** Array of breadcrumb items with label and href */
  items: BreadcrumbItemType[];
  /**
   * Maximum number of breadcrumb items to display before collapsing.
   * If provided and the number of items exceeds this value,
   * the middle items are collapsed into a dropdown.
   */
  maxItems?: number;
}

export function CustomBreadcrumb({ items, maxItems }: CustomBreadcrumbProps) {
  // Determine the rendered items.
  // When maxItems is provided and items exceed that number,
  // show the first item, a dropdown for the middle items, and the last item.
  let renderedItems: (
    | BreadcrumbItemType
    | { isDropdown: true; dropdownItems: BreadcrumbItemType[] }
  )[];

  if (maxItems && items.length > maxItems) {
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const dropdownItems = items.slice(1, items.length - 1);
    renderedItems = [
      firstItem!,
      { isDropdown: true, dropdownItems },
      lastItem!,
    ];
  } else {
    renderedItems = items;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {renderedItems.map((item, index) => {
          const isLast = index === renderedItems.length - 1;
          return (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {"isDropdown" in item && item.isDropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <BreadcrumbEllipsis className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {item.dropdownItems.map((dropdownItem, idx) => (
                        <DropdownMenuItem key={idx}>
                          <BreadcrumbLink href={dropdownItem.href}>
                            {dropdownItem.label}
                          </BreadcrumbLink>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : isLast ? (
                  <BreadcrumbPage>
                    {(item as BreadcrumbItemType).label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={(item as BreadcrumbItemType).href}>
                    {(item as BreadcrumbItemType).label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
