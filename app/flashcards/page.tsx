import LeftSidebar from "@/components/sidebar/sidebar";

const Page = () => {
  // data fetching
  // hooks
  // local variables
  // functions
  // return
  return (
    <>
      <main className="grid grid-cols-12 gap-4">
        <section className="col-span-6 bg-amber-50 lg:col-span-5 xl:col-span-4">
          <LeftSidebar />
        </section>
        <section className="col-span-6 bg-blue-50 lg:col-span-7 xl:col-span-8"></section>
      </main>
    </>
  );
};
export default Page;
