import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { SignedIn, SignOutButton } from "@clerk/nextjs";

const Header = () => {
  // hooks
  // local variables
  // functions
  // return
  return (
    <>
      <header className="flex h-16 items-center justify-end gap-4 p-4">
        <SignedIn>
          <SignOutButton>
            <Button
              variant="secondary"
              size="sm"
              className="hover:cursor-pointer"
            >
              Sign Out
              <span className="relative mr-1 translate-y-[-2px]">
                <LogOut />
              </span>
            </Button>
          </SignOutButton>
        </SignedIn>
      </header>
    </>
  );
};
export default Header;
