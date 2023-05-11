import { useRouter } from "next/router";
import useUser from "@/lib/use-user";
import { useEffect } from "react";
import Navbar from "./navbar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { teacher, error } = useUser();

  useEffect(() => {
    if (!teacher && error) {
      router.replace("/sign-in");
    }
  }, [router, teacher, error]);

  const getHeaderTitle = () => {
    if (router.pathname === "/") return "Dashboard";
    if (router.pathname.startsWith("/course")) return "My courses";
  };

  return (
    <>
      <Navbar />
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {getHeaderTitle()}
          </h1>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}
