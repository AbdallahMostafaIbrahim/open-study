import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";

export default async function MinimalNavbar() {
  const session = await auth();

  return (
    <nav className="bg-theme-bg top-0 z-20 flex h-20 w-full items-center justify-between border-b border-neutral-600 px-6 pt-2 md:px-12">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/restyle-purple2.png"
            alt="Logo"
            width={150}
            height={40}
          />
        </Link>
      </div>
    </nav>
  );
}
