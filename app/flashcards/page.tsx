import LeftSidebar from "@/components/sidebar";

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
          <LeftSidebar />
        </section>
        <section className="col-span-9 bg-blue-50"></section>
      </main>
    </>
  );
};
export default Page;
