import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/layout";
import ListCourse from "@/components/list-course";
import Calendar from "@/components/calendar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Layout>
      <ListCourse />
      <Calendar />
    </Layout>
  );
}
