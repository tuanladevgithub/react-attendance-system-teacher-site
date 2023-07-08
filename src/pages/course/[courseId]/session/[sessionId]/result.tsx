import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { socket } from "@/lib/socket-client";
import { AttendanceSession } from "@/types/attendance-session.type";
import { AttendanceStatus, SessionResult } from "@/types/session-result.type";
import { Student } from "@/types/student.type";
import { getAttendanceSessionStatus } from "@/utils/attendance-session-util";
import axios from "axios";
import { add, format, formatDistanceStrict, parse } from "date-fns";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

socket.on("student_take_record_session", (result: SessionResult) => {
  //
  const statusDOMChange = document.getElementById(
    `session-result-status-${result.t_student_id}-${result.m_attendance_status_id}`
  );
  if (statusDOMChange) {
    statusDOMChange.style.borderWidth = "4px";
    statusDOMChange.style.borderColor = "rgb(79 70 229)";
    statusDOMChange.style.cursor = "default";
  }

  //
  const timeDOMChange = document.getElementById(
    `session-result-time-${result.t_student_id}`
  );
  if (timeDOMChange) {
    timeDOMChange.textContent = format(
      new Date(result.record_time),
      "HH:mm, dd MMMM yyyy"
    );
  }

  //
  const recordByDOMChange = document.getElementById(
    `session-result-record_by-${result.t_student_id}`
  );
  if (recordByDOMChange) {
    recordByDOMChange.textContent =
      result.record_by_teacher === 1 ? "You" : "Student";
  }

  //
  const ipAddressDOMChange = document.getElementById(
    `session-result-ip_address-${result.t_student_id}`
  );
  if (ipAddressDOMChange) {
    ipAddressDOMChange.textContent = result.ip_address ?? "...";
  }

  //
  const updateCountStatus = document.getElementById(
    `count-session-status-${result.m_attendance_status_id}`
  );
  if (updateCountStatus) {
    updateCountStatus.textContent = (
      Number(updateCountStatus.textContent) + 1
    ).toString();
  }
});

const SessionResultPage = () => {
  const router = useRouter();
  const courseId = router.query.courseId;
  const sessionId = router.query.sessionId;

  const [countTime, setCountTime] = useState<number>(0);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus[]>(
    []
  );
  const [attendanceSession, setAttendanceSession] =
    useState<AttendanceSession>();
  const [students, setStudents] = useState<Student[]>([]);
  const [countStatus, setCountStatus] = useState<
    { attendanceStatusId: number; count: number }[]
  >([]);
  const [listToUpdate, setListToUpdate] = useState<
    { studentId: number; statusId: number }[]
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
    const fetchSessionData = async () => {
      try {
        const { data } = await axios.get<AttendanceSession>(
          `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}/session/${sessionId}`,
          {
            headers: {
              authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
            },
          }
        );

        setAttendanceSession(data);
      } catch (error) {
        setAttendanceSession(undefined);
      }
    };

    if (courseId && sessionId) fetchSessionData();
  }, [courseId, sessionId]);

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

      socket.connect();
      socket.emit("join_session_room", sessionId);
    };

    if (courseId && sessionId) {
      fetchStudentsData();
    }
  }, [courseId, sessionId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountTime(countTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countTime]);

  const handleBulkUpdateStatus = async () => {
    if (listToUpdate.length > 0) {
      // update:
      const { data } = await axios.put(
        `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}/session/${sessionId}/bulk-update-status`,
        { listToUpdate },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
          },
        }
      );

      // reload:
      router.reload();
    }
  };

  return (
    <>
      <Layout>
        {attendanceSession && (
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
            {["Ongoing", "Overtime"].includes(
              getAttendanceSessionStatus(attendanceSession, new Date()).status
            ) && (
              <span className="text-sm italic text-red-500">
                {
                  "Note: You can't update a session manually while it's during official attendance time."
                }
              </span>
            )}

            <div className="flex justify-end m-2">
              <button
                type="button"
                onClick={() => router.push(`/course/${courseId}/session`)}
                className="flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Back to list session
              </button>
            </div>

            <div className="flex justify-between items-center bg-gray-200 w-full h-16 px-2 rounded-t-lg border-solid border bor">
              <div>
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
                  {students.map((student) => (
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
                            id={`session-result-status-${student.id}-${status.id}`}
                            style={
                              student.sessionResult?.m_attendance_status_id ===
                              status.id
                                ? {
                                    borderWidth: "4px",
                                    borderColor: "rgb(79 70 229)",
                                    cursor: "default",
                                  }
                                : {
                                    borderWidth: "1px",
                                    borderColor: "rgb(156 163 175)",
                                    cursor: "pointer",
                                  }
                            }
                            className="w-4 h-4 rounded-full"
                            onClick={(e) => {
                              if (
                                ["Ongoing", "Overtime"].includes(
                                  getAttendanceSessionStatus(
                                    attendanceSession,
                                    new Date()
                                  ).status
                                )
                              ) {
                                toast.error(
                                  "Cannot be changed in the official time!",
                                  {
                                    position: "bottom-right",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    theme: "light",
                                  }
                                );
                              } else {
                                attendanceStatus.forEach((statusItem) => {
                                  const rmEle = document.getElementById(
                                    `session-result-status-${student.id}-${statusItem.id}`
                                  );
                                  if (rmEle) {
                                    rmEle.style.borderWidth = "1px";
                                    rmEle.style.borderColor =
                                      "rgb(156 163 175)";
                                    rmEle.style.cursor = "pointer";
                                  }
                                });

                                e.currentTarget.style.borderWidth = "4px";
                                e.currentTarget.style.borderColor =
                                  "rgb(79 70 229)";
                                e.currentTarget.style.cursor = "default";

                                //
                                const tmpListToUpdate = listToUpdate;
                                const idx = tmpListToUpdate.findIndex(
                                  (item) => item.studentId === student.id
                                );

                                if (idx !== -1) {
                                  tmpListToUpdate[idx] = {
                                    ...tmpListToUpdate[idx],
                                    statusId: status.id,
                                  };
                                } else {
                                  tmpListToUpdate.push({
                                    studentId: student.id,
                                    statusId: status.id,
                                  });
                                }
                                setListToUpdate(tmpListToUpdate);
                              }
                            }}
                          ></div>
                        </td>
                      ))}
                      <td className="px-2 py-4">
                        <span id={`session-result-time-${student.id}`}>
                          {!student.sessionResult
                            ? "..."
                            : format(
                                new Date(student.sessionResult.record_time),
                                "HH:mm, dd MMMM yyyy"
                              )}
                        </span>
                      </td>
                      <td className="px-2 py-4">
                        <span id={`session-result-record_by-${student.id}`}>
                          {!student.sessionResult
                            ? "..."
                            : student.sessionResult.record_by_teacher === 0
                            ? "Student"
                            : "You"}
                        </span>
                      </td>
                      <td className="px-2 py-4 space-x-3">
                        <span id={`session-result-ip_address-${student.id}`}>
                          {student.sessionResult?.ip_address ?? "..."}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center items-center py-2">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      !["Ongoing", "Overtime"].includes(
                        getAttendanceSessionStatus(
                          attendanceSession,
                          new Date()
                        ).status
                      )
                    ) {
                      handleBulkUpdateStatus();
                    }
                  }}
                  className="flex w-fit justify-center rounded-md px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm"
                  style={
                    ["Ongoing", "Overtime"].includes(
                      getAttendanceSessionStatus(attendanceSession, new Date())
                        .status
                    ) || listToUpdate.length === 0
                      ? {
                          backgroundColor: "rgb(107, 114, 128)",
                          cursor: "not-allowed",
                        }
                      : { backgroundColor: "rgb(22, 163, 74)" }
                  }
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default SessionResultPage;
