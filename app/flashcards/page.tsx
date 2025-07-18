import { AppSidebar } from "@/components/app-sidebar";

const Page = () => {
  // data fetching
  // hooks
  // local variables
  // functions
  // return
  return (
    <>
      <main className="grid grid-cols-12 gap-4">
        <section className="col-span-3 bg-amber-50">
          <AppSidebar />
        </section>
      </main>
    </>
  );
};
export default Page;
