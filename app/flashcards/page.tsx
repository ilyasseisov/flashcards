import Dashboard from "@/components/dashboard/dashboard";
import Header from "@/components/header";
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
        <section className="bg-amber-5 col-span-2 md:col-span-6 lg:col-span-5 xl:col-span-4">
          <LeftSidebar />
        </section>
        <section className="bg-blue-5 col-span-10 md:col-span-6 lg:col-span-7 xl:col-span-8">
          <Header />
          <Dashboard />
        </section>
      </main>
    </>
  );
};
export default Page;
