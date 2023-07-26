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

  // const handleBulkUpdateStatus = async () => {
  //   if (listToUpdate.length > 0) {
  //     // update:
  //     const { data } = await axios.put(
  //       `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}/session/${sessionId}/bulk-update-status`,
  //       { listToUpdate },
  //       {
  //         headers: {
  //           authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
  //         },
  //       }
  //     );

  //     // reload:
  //     router.reload();
  //   }
  // };

  return (
    <>
      <Layout>
        {courseId && (
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
            <div className="flex justify-between items-center bg-gray-200 w-full h-16 px-2 rounded-t-lg border-solid border bor">
              {/* <div>
                <div className="flex items-center gap-x-2 text-sm">
                  <span>Session status:</span>
                  <span
                    className="rounded-full text-white px-3 py-0.5"
                    style={{
                      backgroundColor: getAttendanceSessionStatus(
                        attendanceSession,
                        new Date()
                      ).color,
                    }}
                  >
                    {
                      getAttendanceSessionStatus(attendanceSession, new Date())
                        .status
                    }
                  </span>
                  {["Ongoing", "Overtime"].includes(
                    getAttendanceSessionStatus(attendanceSession, new Date())
                      .status
                  ) && (
                    <span>
                      about{" "}
                      {formatDistanceStrict(
                        add(
                          parse(
                            `${attendanceSession.session_date} ${attendanceSession.end_hour}:${attendanceSession.end_min}:0`,
                            "yyyy-MM-dd H:m:s",
                            new Date()
                          ),
                          {
                            minutes:
                              attendanceSession.overtime_minutes_for_late ?? 0,
                          }
                        ),
                        new Date()
                      )}{" "}
                      remaining (including overtime).
                    </span>
                  )}
                </div>
              </div>

              <div className="flex text-sm">
                <div className="mx-2">
                  <span>Students: {students.length}</span>
                </div>

                {attendanceStatus.map((status) => (
                  <div key={status.id} className="mx-2">
                    <span>{status.title}: </span>
                    <span id={`count-session-status-${status.id}`}>
                      {countStatus.find(
                        (item) => item.attendanceStatusId === status.id
                      )?.count ?? 0}
                    </span>
                  </div>
                ))}
              </div> */}
            </div>

            <div className="overflow-x-auto shadow-md">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 bg-gray-50">
                  <tr>
                    <th className="px-2 py-3 whitespace-nowrap">STUDENT ID</th>
                    <th className="px-2 py-3 whitespace-nowrap">NAME</th>
                    <th className="px-2 py-3 whitespace-nowrap">EMAIL</th>
                    {sessions.map((session) => (
                      <th
                        key={session.id}
                        className="px-2 py-3 whitespace-nowrap"
                      >
                        {format(new Date(session.session_date), "dd MMM yyyy")}{" "}
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
                  {students.map((student) => (
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
                      {sessions.map((session) => (
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
                  ))}
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
