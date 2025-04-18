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
