import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { AttendanceSession } from "@/types/attendance-session.type";
import { Course } from "@/types/course.type";
import { AttendanceStatus } from "@/types/session-result.type";
import { Student } from "@/types/student.type";
import { classNames } from "@/utils/class-name-util";
import { formatTimeDisplay24Hours } from "@/utils/date-time-util";
import axios from "axios";
import { endOfMonth } from "date-fns";
import { add, format, isBefore, startOfMonth } from "date-fns";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AttendanceHistoryReportPage = () => {
  const router = useRouter();
  const courseId = router.query.courseId;

  const [currentFilter, setCurrentFilter] = useState<string>("Month");
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus[]>(
    []
  );
  const [course, setCourse] = useState<Course>();
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [finishedSessions, setFinishedSessions] = useState<AttendanceSession[]>(
    []
  );
  const [finishedSessionsForChart, setFinishedSessionsForChart] = useState<
    AttendanceSession[]
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

      //
      const finished = data.sessions.filter((session) => {
        const sessionEndTime = add(
          new Date(
            `${session.session_date}T${
              session.end_hour < 10 ? `0${session.end_hour}` : session.end_hour
            }:${
              session.end_min < 10 ? `0${session.end_min}` : session.end_min
            }:00`
          ),
          { minutes: session.overtime_minutes_for_late }
        );

        return isBefore(sessionEndTime, new Date());
      });
      setFinishedSessions(finished);

      if (currentFilter === "Month") {
        const from = format(startOfMonth(new Date()), "yyyy-MM-dd");
        const to = format(endOfMonth(new Date()), "yyyy-MM-dd");

        setFinishedSessionsForChart(
          finished.filter(
            (session) =>
              session.session_date >= from && session.session_date <= to
          )
        );
      } else {
        setFinishedSessionsForChart(finished);
      }
    };

    if (courseId) fetchData();
  }, [courseId, currentFilter]);

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
                        Course
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        <Link
                          href={`/course/${course.id}`}
                          className="text-blue-500 underline"
                        >
                          {course.course_code} - {course.subject?.subject_code}{" "}
                          - {course.subject?.subject_name}
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

          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
            <div className="text-gray-700 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-0">
              <div className="shadow-lg text-sm lg:col-span-1">
                <div className="flex justify-between items-center bg-gray-200 w-full px-2 py-2 rounded-t-lg border-solid border bor">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-xl font-semibold leading-7 text-gray-900">
                      Attendance ratio per session
                    </h3>
                  </div>

                  <div className="flex space-x-1">
                    {["All", "Month"].map((item) => (
                      <div
                        key={item}
                        onClick={() => setCurrentFilter(item)}
                        className={classNames(
                          item === currentFilter
                            ? "bg-gray-700 text-white cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-700 hover:text-white cursor-pointer",
                          "rounded-md border-solid border-gray-400 border px-3 text-sm font-medium"
                        )}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chart-group w-full bg-white p-4">
                  <div className="overflow-x-auto grid grid-rows-[36px,250px,40px]">
                    <div className="flex">
                      <div className="w-10 h-full"></div>
                      <div className="w-full"></div>
                    </div>

                    <div className="flex">
                      <div className="w-10 h-full">
                        <div className="h-full grid grid-rows-5">
                          <div>100%</div>
                          <div>80%</div>
                          <div>60%</div>
                          <div>40%</div>
                          <div>20%</div>
                        </div>
                      </div>

                      <div className="w-full border-l border-b border-slate-300">
                        <div className="h-full flex">
                          {finishedSessionsForChart.map((session) => {
                            const counts = session.attendanceResults?.filter(
                              (result) =>
                                [1, 2, 3].includes(
                                  result.m_attendance_status_id ?? 0
                                )
                            );

                            const percent =
                              Math.round(
                                ((counts?.length ?? 0) * 1000) / students.length
                              ) / 10;

                            return (
                              <div
                                key={session.id}
                                className="w-[90px] flex flex-col justify-end items-center hover:bg-slate-200"
                              >
                                <div
                                  className="w-10 bg-cyan-400 text-center text-white"
                                  style={{ height: `${percent}%` }}
                                >
                                  {percent}%
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="w-10 h-full"></div>
                      <div className="w-full">
                        <div className="h-full flex">
                          {finishedSessionsForChart.map((session) => (
                            <div
                              key={session.id}
                              className="w-[90px] text-center"
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
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-1 shadow-lg text-sm lg:col-span-1 lg:mt-0">
                <div className="flex justify-between items-center bg-gray-200 w-full px-2 py-2 rounded-t-lg border-solid border bor">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-xl font-semibold leading-7 text-gray-900">
                      Report
                    </h3>
                  </div>
                </div>

                <div className="chart-group w-full bg-white p-2"></div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
            <div className="text-sm text-red-400 italic mb-2">
              <span>
                *Notice the symbols of attendance status:{" "}
                {attendanceStatus
                  .map((status) => `${status.acronym} - ${status.title}`)
                  .join(",  ")}
              </span>
            </div>

            <div className="flex justify-between items-center bg-gray-200 w-full px-2 py-2 rounded-t-lg border-solid border bor">
              <div className="px-4 sm:px-0">
                <h3 className="text-xl font-semibold leading-7 text-gray-900">
                  Report detail
                </h3>
              </div>
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
