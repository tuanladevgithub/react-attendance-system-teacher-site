import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { AttendanceSession } from "@/types/attendance-session.type";
import { AttendanceStatus } from "@/types/session-result.type";
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
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus[]>(
    []
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [countStatus, setCountStatus] = useState<
    { attendanceStatusId: number; count: number }[]
  >([]);

  useEffect(() => {
    const fetchListOfAttendanceStatus = async () => {
      const { data } = await axios.get<AttendanceStatus[]>(
        `${ATTENDANCE_API_DOMAIN}/attendance-status`
      );

      setAttendanceStatus(data);
    };

    fetchListOfAttendanceStatus();
  }, []);

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

      const tmp: { attendanceStatusId: number; count: number }[] = [];
      data.students.forEach((student) => {
        if (student.sessionResult) {
          const attendanceStatusId =
            student.sessionResult.m_attendance_status_id;
          if (attendanceStatusId) {
            const idx = tmp.findIndex(
              (item) => item.attendanceStatusId === attendanceStatusId
            );

            if (idx !== -1) {
              tmp[idx] = { ...tmp[idx], count: tmp[idx].count + 1 };
            } else {
              tmp.push({ attendanceStatusId, count: 1 });
            }
          }
        }
      });
      setCountStatus(tmp);
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

              {attendanceStatus.map((status) => (
                <div key={status.id} className="mx-2">
                  <span>
                    {status.title}:{" "}
                    {countStatus.find(
                      (item) => item.attendanceStatusId === status.id
                    )?.count ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-2 py-3">
                    Student ID
                  </th>
                  <th scope="col" className="px-2 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-2 py-3">
                    Email address
                  </th>
                  {attendanceStatus.map((status) => (
                    <th key={status.id} scope="col" className="px-2 py-3">
                      {status.acronym}
                    </th>
                  ))}
                  <th scope="col" className="px-2 py-3">
                    Record time
                  </th>
                  <th scope="col" className="px-2 py-3">
                    Record by
                  </th>
                  <th scope="col" className="px-2 py-3">
                    IP address
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, studentIdx) => (
                  <tr
                    key={student.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <td className="px-2 py-4">{student.student_code}</td>
                    <td className="px-2 py-4">{`${student.last_name} ${student.first_name}`}</td>
                    <td className="px-2 py-4">{student.email}</td>
                    {attendanceStatus.map((status) => (
                      <td
                        key={student.id + "" + status.id}
                        className="px-2 py-4"
                      >
                        <div
                          id={`session-result-${student.id}-${status.id}`}
                          style={
                            student.sessionResult?.m_attendance_status_id ===
                            status.id
                              ? {
                                  borderWidth: "4px",
                                  borderColor: "rgb(79 70 229)",
                                }
                              : {
                                  borderWidth: "1px",
                                  borderColor: "rgb(156 163 175)",
                                  cursor: "pointer",
                                }
                          }
                          className="w-4 h-4 rounded-full"
                          onClick={(e) => {
                            attendanceStatus.forEach((statusItem) => {
                              const rmEle = document.getElementById(
                                `session-result-${student.id}-${statusItem.id}`
                              );
                              if (rmEle) {
                                rmEle.style.borderWidth = "1px";
                                rmEle.style.borderColor = "rgb(156 163 175)";
                                rmEle.style.cursor = "pointer";
                              }
                            });

                            e.currentTarget.style.borderWidth = "4px";
                            e.currentTarget.style.borderColor =
                              "rgb(79 70 229)";
                            e.currentTarget.style.cursor = "default";
                          }}
                        ></div>
                      </td>
                    ))}
                    <td className="px-2 py-4">
                      {!student.sessionResult
                        ? "..."
                        : format(
                            new Date(student.sessionResult.record_time),
                            "HH:mm, dd MMMM yyyy"
                          )}
                    </td>
                    <td className="px-2 py-4">
                      {!student.sessionResult
                        ? "..."
                        : student.sessionResult.record_by_teacher === 0
                        ? "Student"
                        : "You"}
                    </td>
                    <td className="px-2 py-4 space-x-3">
                      {student.sessionResult?.ip_address ?? "..."}
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
