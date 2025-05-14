"use client";

import { AlertCircle, ArrowLeft, Home, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

// Define error messages for common authentication errors
const errorMessages: Record<string, { title: string; description: string }> = {
  AccessDenied: {
    title: "Access Denied",
    description:
      "You don't have permission to access this resource. Please check your credentials and try again.",
  },
  CredentialsSignin: {
    title: "Invalid Credentials",
    description:
      "The email or password you entered is incorrect. Please try again.",
  },
  OAuthSignin: {
    title: "OAuth Error",
    description:
      "There was a problem signing in with your OAuth provider. Please try again.",
  },
  OAuthCallback: {
    title: "OAuth Callback Error",
    description:
      "There was a problem with the OAuth callback. Please try again.",
  },
  OAuthCreateAccount: {
    title: "Account Creation Failed",
    description:
      "There was a problem creating your account. Please try again later.",
  },
  EmailCreateAccount: {
    title: "Account Creation Failed",
    description:
      "There was a problem creating your account with this email. Please try again later.",
  },
  Callback: {
    title: "Callback Error",
    description:
      "There was a problem with the authentication callback. Please try again.",
  },
  EmailSignin: {
    title: "Email Sign In Failed",
    description: "The magic link sign-in failed. Please request a new link.",
  },
  default: {
    title: "Authentication Error",
    description:
      "An unknown error occurred during authentication. Please try again later.",
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState(errorMessages.default);

  useEffect(() => {
    // Get error from URL parameters
    const errorParam = searchParams.get("error");
    setError(errorParam);

    // Set appropriate error message
    if (errorParam && errorMessages[errorParam]) {
      setErrorDetails(errorMessages[errorParam]);
    } else {
      setErrorDetails(errorMessages.default);
    }
  }, [searchParams]);

  return (
    <div className="flex h-[100vh] items-center justify-center">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>
          <CardTitle className="text-center text-2xl">
            {errorDetails?.title}
          </CardTitle>
          <CardDescription className="text-center">
            There was a problem with your authentication request
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorDetails?.description}</AlertDescription>
          </Alert>

          {error && (
            <div className="bg-muted rounded-md p-3 font-mono text-xs">
              <code>Error: {error}</code>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go back home
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/auth/sign-in">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to sign in
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
