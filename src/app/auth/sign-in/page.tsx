import { MessageCircleQuestion } from "lucide-react";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import GoogleSignIn from "~/app/_components/auth/google";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { NAME, VERSION } from "~/lib/constants";
import { auth } from "~/server/auth";

export default async function SignIn() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <>
      <div className="flex h-[calc(100vh-(--spacing(16)))] w-full items-center justify-center">
        <Card className="w-[380px]">
          <CardHeader className="text-center">
            <CardTitle>Welcome to {NAME}</CardTitle>
            <CardDescription>
              Please sign in to continue using the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <GoogleSignIn />
          </CardContent>
        </Card>
      </div>
      <div className="flex h-16 items-center justify-center">
        <p>{NAME}</p>
        <div className="bg-foreground mx-2 h-4"></div>
        <p className="flex items-center">
          <MessageCircleQuestion className="mr-1" size={18} /> Support
        </p>
        <div className="bg-foreground mx-2 h-4"></div>
        <p>Version {VERSION}</p>
      </div>
    </>
  );
}
