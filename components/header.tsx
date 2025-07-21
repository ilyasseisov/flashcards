import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  // hooks
  // local variables
  // functions
  // return
  return (
    <>
      <header className="mt-2 flex justify-end p-4">
        <Button variant="outline" size="sm">
          <span className="relative mr-1 translate-y-[-2px]">
            <LogOut />
          </span>
          Log out
        </Button>
      </header>
    </>
  );
};
export default Header;
