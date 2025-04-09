import Link from "next/link";
import { redirect } from "next/navigation";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <main>
      <h1>Hello, world</h1>
    </main>
  );
}
