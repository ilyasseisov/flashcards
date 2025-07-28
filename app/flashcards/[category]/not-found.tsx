import ROUTES from "@/constants/routes";
import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href={ROUTES.APP}>Return to dashboard</Link>
    </div>
  );
}
