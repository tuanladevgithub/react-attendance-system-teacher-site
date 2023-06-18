import Layout from "@/components/layout";
import { useRouter } from "next/router";

const CourseDetail = () => {
  const router = useRouter();
  const courseId = router.query.courseId;
  return (
    <>
      <Layout>course detail page</Layout>
    </>
  );
};

export default CourseDetail;
