import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { AttendanceSession } from "@/types/attendance-session.type";
import { Course } from "@/types/course.type";
import { AttendanceStatus } from "@/types/session-result.type";
import { Student } from "@/types/student.type";
import { classNames } from "@/utils/class-name-util";
import { formatTimeDisplay24Hours } from "@/utils/date-time-util";
import axios from "axios";
import { add, format, isBefore } from "date-fns";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AttendanceHistoryReportPage = () => {
  const router = useRouter();
  const courseId = router.query.courseId;

  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus[]>(
    []
  );
  const [course, setCourse] = useState<Course>();
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [finishedSessions, setFinishedSessions] = useState<AttendanceSession[]>(
    []
  );
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
    const fetchCourseData = async () => {
      const { data } = await axios.get<Course>(
        `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
          },
        }
      );
      setCourse(data);
    };

    if (courseId) fetchCourseData();
  }, [courseId]);

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
      setFinishedSessions(
        data.sessions.filter((session) => {
          const sessionEndTime = add(
            new Date(
              `${session.session_date}T${
                session.end_hour < 10
                  ? `0${session.end_hour}`
                  : session.end_hour
              }:${
                session.end_min < 10 ? `0${session.end_min}` : session.end_min
              }:00`
            ),
            { minutes: session.overtime_minutes_for_late }
          );

          return isBefore(sessionEndTime, new Date());
        })
      );
    };

    if (courseId) fetchData();
  }, [courseId]);

  const handleExportCSV = async () => {
    const { data } = await axios.get(
      `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}/export-history`,
      {
        headers: {
          authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
        },
        responseType: "blob",
      }
    );

    const href = URL.createObjectURL(data);

    const anchorElement = document.createElement("a");

    anchorElement.href = href;
    anchorElement.download = `${course?.subject?.subject_code}_${course?.course_code}.csv`;

    document.body.appendChild(anchorElement);
    anchorElement.click();

    document.body.removeChild(anchorElement);
    URL.revokeObjectURL(href);
  };

  return (
    <Layout>
      {course && (
        <>
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
            <div className="bg-white shadow-xl rounded-lg my-2 p-4">
              <div>
                <div className="px-4 sm:px-0">
                  <h3 className="text-xl font-semibold leading-7 text-gray-900">
                    Summary
                  </h3>
                </div>
                <div className="mt-6 border-t border-gray-100">
                  <dl className="divide-y divide-gray-200">
                    <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Subject
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {course.subject?.subject_code} -{" "}
                        {course.subject?.subject_name}
                      </dd>
                    </div>
                    <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Course code
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        <Link
                          href={`/course/${course.id}`}
                          className="text-blue-500 underline"
                        >
                          {course.course_code}
                        </Link>
                      </dd>
                    </div>
                    <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Total sessions
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {sessions.length} sessions
                      </dd>
                    </div>
                    <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Finished sessions
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {finishedSessions.length} sessions
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
            
          </div> */}

          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
            <div className="text-sm text-red-400 italic mb-2">
              <span>*Notice the symbols of attendance status:</span>
              <ul
                role="list"
                className="ml-5 marker:text-red-400 list-disc pl-5 space-y-1"
              >
                {attendanceStatus.map((status) => (
                  <li key={status.id}>
                    {status.acronym} - {status.title}
                  </li>
                ))}
              </ul>
            </div>

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
                    <th className="px-2 py-3 whitespace-nowrap">Student ID</th>
                    <th className="px-2 py-3 whitespace-nowrap">Name</th>
                    <th className="px-2 py-3 whitespace-nowrap">Email</th>
                    <th className="px-2 py-3 whitespace-nowrap">Overview</th>
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

                    const countAbsentSession = finishedSessions.filter(
                      (session) => {
                        const studentRs = session.attendanceResults?.find(
                          (result) => result.t_student_id === student.id
                        );

                        if (!studentRs) return true;
                        else
                          return (
                            !studentRs.m_attendance_status_id ||
                            studentRs.m_attendance_status_id === 4
                          );
                      }
                    ).length;

                    const attendanceRate =
                      100 -
                      (countAbsentSession / finishedSessions.length) * 100;

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
                          <div className="flex items-center gap-x-2">
                            {finishedSessions.length > 0 && (
                              <div
                                className={classNames(
                                  "h-full w-16 px-2 flex items-center justify-center",
                                  attendanceRate >= course.attendance_rate
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                )}
                              >
                                <span className="text-white">
                                  {attendanceRate.toFixed(1)}%
                                </span>
                              </div>
                            )}
                            <span>{overviewStatus.join(" ")}</span>
                          </div>
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
        </>
      )}
    </Layout>
  );
};

export default AttendanceHistoryReportPage;
