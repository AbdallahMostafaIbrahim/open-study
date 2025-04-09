import Link from "next/link";
import { redirect } from "next/navigation";

import { LatestPost } from "~/app/_components/post";
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
    <main>
      <h1>Hello, world</h1>
    </main>
  );
}
