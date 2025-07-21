import Header from "@/components/header";
import LeftSidebar from "@/components/sidebar/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function FlashcardsLayout({ children }: LayoutProps) {
  return (
    <main className="grid grid-cols-12 gap-4">
      <section className="col-span-2 bg-amber-50 md:col-span-6 lg:col-span-5 xl:col-span-4 2xl:col-span-3">
        <LeftSidebar />
      </section>
      <section className="col-span-10 bg-blue-50 md:col-span-6 lg:col-span-7 xl:col-span-8 2xl:col-span-9">
        <Header />
        {children}
      </section>
    </main>
  );
}
