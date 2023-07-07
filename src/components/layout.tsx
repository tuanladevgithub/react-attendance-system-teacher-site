import { useRouter } from "next/router";
import useUser from "@/lib/use-user";
import { useEffect } from "react";
import Navbar from "./navbar";
import { socket } from "@/lib/socket-client";

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

    if (router.pathname !== "/course/[courseId]/session/[sessionId]/result") {
      if (socket.connected) socket.disconnect();
    }
  }, [router, teacher, error]);

  const getHeaderTitle = () => {
    if (router.pathname === "/") return ["Dashboard"];

    if (router.pathname === "/course") return ["My courses"];

    if (router.pathname === "/course/[courseId]")
      return ["My courses", "Course detail"];

    if (router.pathname === "/course/[courseId]/add-session")
      return ["My courses", "Course detail", "Add sessions"];

    if (router.pathname === "/course/[courseId]/session")
      return ["My courses", "Course detail", "Attendance sessions"];

    if (router.pathname === "/course/[courseId]/session/[sessionId]/result")
      return ["My courses", "Course detail", "Attendance sessions", "Results"];

    return [];
  };

  return (
    <>
      <Navbar />
      {getHeaderTitle().length > 0 && (
        <header className="bg-white shadow">
          <div className="flex items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {getHeaderTitle()[0]}
            </h1>

            {getHeaderTitle()[1] && (
              <h2 className="text-xl mx-2 tracking-tight text-gray-700">
                {"/ " + getHeaderTitle()[1]}
              </h2>
            )}

            {getHeaderTitle()[2] && (
              <h2 className="text-xl mx-2 tracking-tight text-gray-700">
                {"/ " + getHeaderTitle()[2]}
              </h2>
            )}

            {getHeaderTitle()[3] && (
              <h2 className="text-xl mx-2 tracking-tight text-gray-700">
                {"/ " + getHeaderTitle()[3]}
              </h2>
            )}
          </div>
        </header>
      )}
      <main>{children}</main>
    </>
  );
}
