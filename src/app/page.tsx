import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "~/components/logo";
import { SignOutButton } from "~/components/sign-out-button";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in");
  }

  if (
    session?.user.admin &&
    !(session.user.student || session.user.professor)
  ) {
    redirect("/admin");
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-4">
        <Logo className="fill-primary" size={86} />
        <h1 className="text-5xl font-bold">Open Study</h1>
      </div>
      <div className="h-6"></div>
      <p className="w-1/2 text-center text-lg opacity-70">
        Open Study is an LMS that allows you to create and manage your courses,
        students, and professors while utilizing AI. It is designed to be simple
        and easy to use, so you can focus on what matters most: teaching and
        learning.
      </p>
      <div className="h-4"></div>
      <SignOutButton />
    </main>
  );
}
