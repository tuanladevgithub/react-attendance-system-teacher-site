import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { AttendanceSession } from "@/types/attendance-session.type";
import { Course } from "@/types/course.type";
import {
  Cog8ToothIcon,
  PlayIcon,
  QrCodeIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import emptyDataImg from "../../../../../public/empty_data_icon.svg";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const filterMenus = ["All", "Months", "Weeks", "Days"];

const formatTimeDisplay = (hour: number, min: number) => {
  const type = hour < 12 ? "AM" : "PM";
  let hourDisplay = "";
  if (type === "AM") hourDisplay = hour < 10 ? `0${hour}` : `${hour}`;
  else hourDisplay = hour - 12 < 10 ? `0${hour - 12}` : `${hour - 12}`;

  const minDisplay = min < 10 ? `0${min}` : `${min}`;

  return `${hourDisplay}:${minDisplay}${type}`;
};

const CourseAttendanceList = () => {
  const router = useRouter();
  const courseId = router.query.courseId;
  const [currentFilter, setCurrentFilter] = useState<string>("Weeks");
  const [attendanceSessions, setAttendanceSessions] = useState<
    AttendanceSession[]
  >([]);

  useEffect(() => {
    const fetchListSessionData = async () => {
      const { data } = await axios.get<{
        course: Course;
        attendanceSessions: AttendanceSession[];
      }>(`${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}`, {
        headers: {
          authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      setAttendanceSessions(data.attendanceSessions);
    };

    if (courseId) fetchListSessionData();
  }, [courseId]);

  return (
    <>
      <Layout>
        {!attendanceSessions || attendanceSessions.length < 1 ? (
          <div className="mx-auto mt-40 w-full h-40 flex justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <div>
                <Image
                  className="h-auto w-auto"
                  src={emptyDataImg}
                  alt="Data empty to display"
                />
              </div>
              <div className="text-gray-400">There is no data to display.</div>
              <div className="mt-6">
                <Link
                  href={`/course/${courseId}/add-session`}
                  type="button"
                  className="flex w-fit justify-center rounded-md bg-green-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  + Add session
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
            <div className="flex justify-between items-center bg-gray-200 w-full h-16 px-4 rounded-t-lg border-solid border bor">
              <div>
                <Link
                  href={`/course/${courseId}/add-session`}
                  type="button"
                  className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  + Add session
                </Link>
              </div>

              <div className="flex space-x-1">
                {filterMenus.map((item) => (
                  <div
                    key={item}
                    onClick={() => setCurrentFilter(item)}
                    className={classNames(
                      item === currentFilter
                        ? "bg-gray-700 text-white cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-700 hover:text-white cursor-pointer",
                      "rounded-md border-solid border-gray-400 border px-3 py-1 text-sm font-medium"
                    )}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-x-auto shadow-md">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all-search"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="checkbox-all-search"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="checkbox-table-search-1"
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </div>
                      </td>
                      <td className="w-44 px-6 py-4">
                        {format(
                          new Date(session.session_date),
                          "eee dd MMM yyyy"
                        )}
                      </td>
                      <td className="w-44 px-6 py-4">{`${formatTimeDisplay(
                        session.start_hour,
                        session.start_min
                      )} - ${formatTimeDisplay(
                        session.end_hour,
                        session.end_min
                      )}`}</td>
                      <td className="w-36 px-6 py-4">All students</td>
                      <td className="px-6 py-4">{session.description}</td>
                      <td className="flex items-center px-6 py-4 space-x-3">
                        <Link
                          href={`/course/${courseId}/session/${session.id}/qr-code`}
                          target="_blank"
                          className="font-medium text-gray-950"
                        >
                          <div className="w-5 mr-1">
                            <QrCodeIcon />
                          </div>
                        </Link>

                        <Link href="#" className="font-medium text-blue-500">
                          <div className="w-5 mr-1">
                            <PlayIcon />
                          </div>
                        </Link>

                        <Link href="#" className="font-medium text-gray-600">
                          <div className="w-5 mr-1">
                            <Cog8ToothIcon />
                          </div>
                        </Link>

                        <Link href="#" className="font-medium text-red-400">
                          <div className="w-5 mr-1">
                            <TrashIcon />
                          </div>
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <td className="w-44 px-6 py-4">Thu 20 Apr 2023</td>
                  <td className="w-44 px-6 py-4">17:20AM - 18:00AM</td>
                  <td className="w-36 px-6 py-4">All students</td>
                  <td className="px-6 py-4">Regular class session</td>
                  <td className="flex items-center px-6 py-4 space-x-3">
                    <Link href="#" className="font-medium text-gray-950">
                      <div className="w-5 mr-1">
                        <QrCodeIcon />
                      </div>
                    </Link>

                    <Link href="#" className="font-medium text-blue-600">
                      <div className="w-5 mr-1">
                        <PlayIcon />
                      </div>
                    </Link>

                    <Link href="#" className="font-medium text-gray-950">
                      <div className="w-5 mr-1">
                        <Cog8ToothIcon />
                      </div>
                    </Link>

                    <Link href="#" className="font-medium text-red-500">
                      <div className="w-5 mr-1">
                        <TrashIcon />
                      </div>
                    </Link>
                  </td>
                </tr> */}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default CourseAttendanceList;
