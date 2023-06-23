import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { AttendanceSession } from "@/types/attendance-session.type";
import { Student } from "@/types/student.type";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SessionResult = () => {
  const router = useRouter();
  const courseId = router.query.courseId;
  const sessionId = router.query.sessionId;
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudentsData = async () => {
      const { data } = await axios.get<{
        session: AttendanceSession;
        students: Student[];
      }>(
        `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}/session/${sessionId}/result`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
          },
        }
      );

      setStudents(data.students);
    };

    if (courseId && sessionId) fetchStudentsData();
  }, [courseId, sessionId]);

  return (
    <>
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between items-center bg-gray-200 w-full h-16 px-4 rounded-t-lg border-solid border bor">
            <div>
              <Link
                href={`/course/${courseId}/session`}
                className="flex w-full justify-center rounded-md bg-gray-700 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Back to list session
              </Link>
            </div>

            <div className="flex text-sm">
              <div className="mx-2">
                <span>Students: {students.length}</span>
              </div>

              <div className="mx-2">
                <span>Present: 0</span>
              </div>

              <div className="mx-2">
                <span>Late: 0</span>
              </div>

              <div className="mx-2">
                <span>Excused: 0</span>
              </div>

              <div className="mx-2">
                <span>Absent: 0</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Student ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    First name / Last name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    P
                  </th>
                  <th scope="col" className="px-6 py-3">
                    E
                  </th>
                  <th scope="col" className="px-6 py-3">
                    L
                  </th>
                  <th scope="col" className="px-6 py-3">
                    A
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Record time
                  </th>
                  <th scope="col" className="px-6 py-3">
                    IP address
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">{student.student_code}</td>
                    <td className="px-6 py-4">{`${student.first_name} ${student.last_name}`}</td>
                    <td className="px-6 py-4">{student.email}</td>
                    <td className="px-6 py-4">
                      <input
                        type="radio"
                        name={`session-result-${student.id}`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="radio"
                        name={`session-result-${student.id}`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="radio"
                        name={`session-result-${student.id}`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="radio"
                        name={`session-result-${student.id}`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      {!student.sessionResult
                        ? "..."
                        : format(
                            new Date(student.sessionResult.record_time),
                            "MMM dd yyyy - HH:mm"
                          )}
                    </td>
                    <td className="px-6 py-4 space-x-3">
                      {!student.sessionResult
                        ? "..."
                        : student.sessionResult.ip_address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SessionResult;
