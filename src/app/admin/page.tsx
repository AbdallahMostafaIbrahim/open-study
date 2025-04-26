import { Logo } from "~/components/logo";
import { SignOutButton } from "~/components/sign-out-button";
import { NAME } from "~/lib/constants";

export default async function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-4">
        <Logo className="fill-primary" size={86} />
        <h1 className="text-5xl font-bold">{NAME}</h1>
      </div>
      <div className="h-6"></div>
      <p className="w-1/2 text-center text-lg opacity-70">
        {NAME} is an LMS that allows you to create and manage your courses,
        students, and professors while utilizing AI. It is designed to be simple
        and easy to use, so you can focus on what matters most: teaching and
        learning.
      </p>
      <div className="h-4"></div>
      <SignOutButton />
    </main>
  );
}
