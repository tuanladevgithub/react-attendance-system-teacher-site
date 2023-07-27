import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { STUDENT_SITE_DOMAIN } from "@/constants/common-constant";
import { AttendanceSession } from "@/types/attendance-session.type";
import { getAttendanceSessionStatus } from "@/utils/attendance-session-util";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/router";
import * as qrcode from "qrcode";
import { useEffect, useState } from "react";
import clockImg from "../../../../../../public/clock.svg";
import { add, formatDistanceStrict, parse } from "date-fns";
import { Course } from "@/types/course.type";

const SessionQRCode = () => {
  const router = useRouter();
  const courseId = router.query.courseId;
  const sessionId = router.query.sessionId;

  const [course, setCourse] = useState<Course>();
  const [attendanceSession, setAttendanceSession] =
    useState<AttendanceSession>();
  const [countDown, setCountDown] = useState<number>();
  const [qrData, setQRData] = useState<string>();
  const [qrImageSrc, setQRImageSrc] = useState<string>();

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
      setCountDown(data.rotate_qrcode_interval_seconds);
    };

    if (courseId) fetchCourseData();
  }, [courseId]);

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
    const fetchQRData = async () => {
      try {
        const { data } = await axios.get<string>(
          `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}/session/${sessionId}/qr-code`,
          {
            headers: {
              authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
            },
          }
        );

        setQRData(data);
      } catch (error) {
        setQRData(undefined);
      }
    };

    if (courseId && sessionId) fetchQRData();
  }, [courseId, sessionId]);

  useEffect(() => {
    if (course && countDown !== undefined) {
      const interval = setInterval(() => {
        if (countDown > 0) {
          setCountDown(countDown - 1);
        } else {
          axios
            .get<string>(
              `${ATTENDANCE_API_DOMAIN}/teacher/course/${course.id}/session/${sessionId}/qr-code`,
              {
                headers: {
                  authorization: `Bearer ${Cookies.get(
                    "teacher_access_token"
                  )}`,
                },
              }
            )
            .then((rs) => {
              setQRData(rs.data);
              setCountDown(course.rotate_qrcode_interval_seconds);
            });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [countDown, course, sessionId]);

  useEffect(() => {
    const updateQRCode = async () => {
      if (qrData)
        setQRImageSrc(
          await qrcode.toDataURL(
            `${STUDENT_SITE_DOMAIN}/course/${courseId}/session/${sessionId}/take-record?token=${qrData}`
          )
        );
    };

    updateQRCode();
  }, [courseId, sessionId, qrData]);

  return (
    <>
      <Layout>
        {attendanceSession && (
          <div className="flex flex-col gap-y-5 w-full h-fit mt-20 justify-center items-center">
            {getAttendanceSessionStatus(attendanceSession, new Date())
              .status === "Finished" ? (
              <>
                <div>
                  <Image
                    className="h-40 w-auto"
                    src={clockImg}
                    alt="Data empty to display"
                  />
                </div>
                <span>The session is over.</span>
                <div>
                  <button
                    type="button"
                    onClick={() => router.push(`/course/${courseId}/session`)}
                    className="flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Back to list session
                  </button>
                </div>
              </>
            ) : getAttendanceSessionStatus(attendanceSession, new Date())
                .status === "Upcoming" ? (
              <>
                <span>
                  The session will begin in about{" "}
                  {formatDistanceStrict(
                    parse(
                      `${attendanceSession.session_date} ${attendanceSession.start_hour}:${attendanceSession.start_min}:0`,
                      "yyyy-MM-dd H:m:s",
                      new Date()
                    ),
                    new Date()
                  )}{" "}
                  later.
                </span>
                <div>
                  <button
                    type="button"
                    onClick={() => router.push(`/course/${courseId}/session`)}
                    className="flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Back to list session
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-x-3">
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
                </div>
                <div className="text-center">
                  {qrImageSrc && (
                    <>
                      <Image
                        src={qrImageSrc}
                        alt="QrCode to attendance"
                        width={400}
                        height={400}
                      />
                      <span>Rotate QR code in {countDown}s.</span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </Layout>
    </>
  );
};

export default SessionQRCode;
