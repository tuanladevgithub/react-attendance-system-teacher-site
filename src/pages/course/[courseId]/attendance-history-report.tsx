import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { AttendanceSession } from "@/types/attendance-session.type";
import { AttendanceStatus } from "@/types/session-result.type";
import { Student } from "@/types/student.type";
import { formatTimeDisplay24Hours } from "@/utils/date-time-util";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AttendanceHistoryReportPage = () => {
  const router = useRouter();
  const courseId = router.query.courseId;

  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus[]>(
    []
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [allowShowDetail, setAllowShowDetail] = useState<boolean>(false);

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
    const fetchData = async () => {
      const { data } = await axios.get<{
        students: Student[];
        sessions: AttendanceSession[];
      }>(
        `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}/attendance-history`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
          },
        }
      );

      setStudents(data.students);
      setSessions(data.sessions);
    };

    if (courseId) fetchData();
  }, [courseId]);

  const handleExportCSV = async () => {};

  return (
    <>
      <Layout>
        {courseId && (
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
            <div className="flex justify-start items-center bg-gray-200 w-full h-16 px-2 rounded-t-lg border-solid border bor">
              <div>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex justify-center rounded-md bg-green-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto shadow-md">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 bg-gray-50">
                  <tr>
                    <th className="px-2 py-3 whitespace-nowrap">STUDENT ID</th>
                    <th className="px-2 py-3 whitespace-nowrap">NAME</th>
                    <th className="px-2 py-3 whitespace-nowrap">EMAIL</th>
                    <th className="px-2 py-3 whitespace-nowrap">OVERVIEW</th>
                    {!allowShowDetail && (
                      <td className="px-2 py-3 whitespace-nowrap">
                        <div>
                          <button
                            type="button"
                            onClick={() => setAllowShowDetail(true)}
                            className="flex justify-center rounded-md bg-blue-600 px-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            More detail
                          </button>
                        </div>
                      </td>
                    )}

                    {allowShowDetail &&
                      sessions.map((session) => (
                        <th
                          key={session.id}
                          className="px-2 py-3 whitespace-nowrap"
                        >
                          {format(
                            new Date(session.session_date),
                            "dd MMM yyyy"
                          )}{" "}
                          {formatTimeDisplay24Hours(
                            session.start_hour,
                            session.start_min
                          )}
                          ~
                          {formatTimeDisplay24Hours(
                            session.end_hour,
                            session.end_min
                          )}
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => {
                    const overviewStatus: string[] = [];
                    attendanceStatus.forEach((status) => {
                      const count = sessions.filter((session) =>
                        session.attendanceResults?.find(
                          (result) =>
                            result.t_student_id === student.id &&
                            result.m_attendance_status_id === status.id
                        )
                      ).length;

                      overviewStatus.push(`${status.acronym}:${count}`);
                    });

                    return (
                      <tr
                        key={student.id}
                        className="bg-white border-b hover:bg-gray-200"
                      >
                        <td className="px-2 py-4 whitespace-nowrap">
                          {student.student_code}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">{`${student.last_name} ${student.first_name}`}</td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {student.email}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {overviewStatus.join(" ")}
                        </td>
                        {!allowShowDetail && (
                          <td className="px-2 py-4 whitespace-nowrap">_</td>
                        )}
                        {allowShowDetail &&
                          sessions.map((session) => (
                            <td
                              key={student.id + "" + session.id}
                              className="px-2 py-4 whitespace-nowrap"
                            >
                              {session.attendanceResults?.find(
                                (sessionResult) =>
                                  sessionResult.t_student_id === student.id
                              )?.attendanceStatus?.acronym ?? "..."}
                            </td>
                          ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default AttendanceHistoryReportPage;
