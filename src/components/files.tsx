"use client";

import { Download, File } from "lucide-react";
import { S3_URL } from "~/lib/constants";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export const FileList = ({
  files,
}: {
  files: {
    id: string;
    link: string;
    name: string | null;
    type: string | null;
  }[];
}) => (
  <div className="flex flex-wrap gap-4">
    {files.map((file) => (
      <div
        key={file.id}
        className="flex w-[300px] justify-between rounded-lg border p-4 transition-shadow hover:shadow-md"
      >
        <div className="flex items-center space-x-3">
          <File className="h-10 w-10 text-blue-500" />
          <div>
            <p className="max-w-[180px] truncate font-medium">
              {file.name || "Unnamed File"}
            </p>
            <p className="text-muted-foreground max-w-[180px] truncate text-xs">
              {file.type || "Unknown type"}
            </p>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                <a
                  href={`${S3_URL}${file.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ))}
  </div>
);
