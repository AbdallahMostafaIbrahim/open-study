import Link from "next/link";
import { redirect } from "next/navigation";

import { LatestPost } from "~/app/_components/post";
import { Logo } from "~/components/logo";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

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
    </main>
  );
}
