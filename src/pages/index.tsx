import { Inter } from "next/font/google";
import Layout from "@/components/layout";
import Calendar from "@/components/calendar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Layout>
      <Calendar />
    </Layout>
  );
}
