import { clsx, type ClassValue } from "clsx";
import type { Session } from "next-auth";
import { twMerge } from "tailwind-merge";
import type { Role } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const initials = (name: string) => {
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.toUpperCase();
};

export function roles(user: Session["user"]) {
  const r: Role[] = [];
  if (user.admin) r.push("admin");
  if (user.professor) r.push("professor");
  if (user.student) r.push("student");
  return r;
}

export const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatDuration = (seconds: number | null | undefined) => {
  if (!seconds) return "No time limit";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = [];
  if (hours > 0) result.push(`${hours}h`);
  if (minutes > 0) result.push(`${minutes}m`);
  if (remainingSeconds > 0 && hours === 0) result.push(`${remainingSeconds}s`);

  return result.join(" ");
};
