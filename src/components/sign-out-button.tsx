"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export const SignOutButton = () => {
  return (
    <Button
      onClick={() => {
        signOut();
      }}
    >
      Sign out
    </Button>
  );
};
