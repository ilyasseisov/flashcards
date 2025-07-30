"use client";

import * as React from "react"; // Import React for useState
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in"; // Corrected import for SignIn elements
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignIn } from "@clerk/nextjs"; // Import the useSignIn hook
import { Icons } from "@/components/ui/icons";

export default function Page() {
  // Use the useSignIn hook to programmatically handle sign-in
  const { isLoaded, signIn } = useSignIn();

  // State to manage loading for the GitHub button
  const [isGithubLoading, setIsGithubLoading] = React.useState(false);

  // State to manage the redirect URL
  const [redirectUrl, setRedirectUrl] = React.useState("/flashcards");

  // Set up the redirect URL on the client side
  React.useEffect(() => {
    setRedirectUrl(`${window.location.origin}/flashcards`);
  }, []);

  // Handle GitHub sign-in via authenticateWithRedirect
  const handleGithubSignIn = async () => {
    if (!isLoaded || isGithubLoading) return; // Prevent multiple clicks or if SDK not loaded

    setIsGithubLoading(true); // Set loading state to true

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_github", // Specify the GitHub OAuth strategy
        redirectUrl, // Dynamic redirect URL after successful sign-in
        redirectUrlComplete: redirectUrl, // This is often the same for simplicity
      });
      // Clerk will now handle the redirect to GitHub, and then back to dynamicRedirectUrl
      // The loading state will automatically reset as the page unmounts/redirects
    } catch (error) {
      console.error("GitHub sign-in failed:", error);
      setIsGithubLoading(false); // Reset loading state on error
      // You can add a user-facing error message here (e.g., using a toast)
    }
  };

  return (
    <div className="bg-background fixed inset-0 flex items-center justify-center overflow-hidden">
      <SignIn.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <SignIn.Step name="start">
              <Card className="mx-4 w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                  <CardTitle className="text-2xl font-bold">
                    Welcome back
                  </CardTitle>
                  <CardDescription>
                    Sign in to your account to continue
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Replaced Clerk.Connection with a standard Button and custom onClick */}
                  <Button
                    variant="outline"
                    type="button"
                    // Disable if Clerk SDK not loaded, or if GitHub button is already loading
                    disabled={isGlobalLoading || !isLoaded || isGithubLoading}
                    className="w-full"
                    size="lg"
                    onClick={handleGithubSignIn} // Call our custom handler
                  >
                    {isGithubLoading ? ( // Conditionally render based on isGithubLoading
                      <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Icons.gitHub className="mr-2 h-5 w-5" />
                        Continue with GitHub
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Button variant="link" size="sm" asChild>
                      <Clerk.Link
                        navigate="sign-up"
                        className="text-secondary-foreground/40"
                      >
                        Don&apos;t have an account? Sign up
                      </Clerk.Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </SignIn.Step>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </div>
  );
}

// import { SignIn } from "@clerk/nextjs";

// export default function Page() {
//   return <SignIn />;
// }
