import { Inter } from "next/font/google";
import Layout from "@/components/layout";
import Calendar from "@/components/calendar";
import RecentCourses from "@/components/recent-courses";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Layout>
      <RecentCourses />
      <Calendar />
    </Layout>
  );
}
