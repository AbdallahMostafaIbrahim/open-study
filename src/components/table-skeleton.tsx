"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";
import { useSidebar } from "./ui/sidebar";

interface Column {
  /** A unique key for the column (also used as key when rendering) */
  key: string;
  /** Custom width class (e.g. "w-[150px]") for the skeleton cell */
  width?: string;
  /** Alignment for the cell content: "left", "center", or "right" */
  align?: "left" | "center" | "right";
}

export interface TableSkeletonProps {
  /** Array of column definitions */
  columns: Column[];
  /** Number of skeleton rows to display */
  rows?: number;
  /** Height class for the skeleton element (default: "h-4") */
  cellHeight?: string;
  /** Fallback width class if not provided in column definition (default: "w-[100px]") */
  defaultCellWidth?: string;
}

export default function TableSkeleton({
  columns,
  rows = 5,
  cellHeight = "h-4",
  defaultCellWidth = "w-[100px]",
}: TableSkeletonProps) {
  const { open, isMobile } = useSidebar();
  return (
    <div
      className={open && !isMobile ? "w-[calc(100vw-16rem-4rem))]" : "w-full"}
    >
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={column.align ? `text-${column.align}` : ""}
              >
                <Skeleton
                  className={`${cellHeight} ${
                    column.width || defaultCellWidth
                  }`}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={column.align ? `text-${column.align}` : ""}
                >
                  <Skeleton
                    className={`${cellHeight} ${
                      column.width || defaultCellWidth
                    }`}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
