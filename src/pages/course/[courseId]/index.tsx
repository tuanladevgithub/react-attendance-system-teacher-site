import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { Course, CourseSchedule } from "@/types/course.type";
import { Student } from "@/types/student.type";
import { classNames } from "@/utils/class-name-util";
import { formatTimeDisplay } from "@/utils/date-time-util";
import { ClockIcon } from "@heroicons/react/24/outline";
import {
  CalendarDaysIcon,
  CheckIcon,
  // ClockIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
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

const CourseDetail = () => {
  const router = useRouter();
  const courseId = router.query.courseId;

  const [course, setCourse] = useState<Course>();
  const [courseDescriptionToUpdate, setCourseDescriptionToUpdate] =
    useState<string>();
  const [courseQRRotateSecondsToUpdate, setCourseQRRotateSecondsToUpdate] =
    useState<number>();
  const [coursePreventSameIpToUpdate, setCoursePreventSameIpToUpdate] =
    useState<0 | 1>();
  const [courseAttendanceRateToUpdate, setCourseAttendanceRateToUpdate] =
    useState<number>();
  const [schedulesByDayOfWeek, setSchedulesByDayOfWeek] = useState<
    { dayOfWeek: string; schedules: CourseSchedule[] }[]
  >([]);
  const [showListStudent, setShowListStudent] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchStudentText, setSearchStudentText] = useState<string>();

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
      const schedules = data.courseSchedules;
      if (schedules) {
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        const tmpSchedulesDayOfWeek: {
          dayOfWeek: string;
          schedules: CourseSchedule[];
        }[] = [];
        days.forEach((dayOfWeek, idx) => {
          const dayOfWeekSchedules = schedules.filter(
            (schedule) => schedule.day_of_week == idx
          );
          if (dayOfWeekSchedules.length > 0) {
            tmpSchedulesDayOfWeek.push({
              dayOfWeek,
              schedules: dayOfWeekSchedules,
            });
          }
        });
        setSchedulesByDayOfWeek(tmpSchedulesDayOfWeek);
      }
    };

    if (courseId) fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    const fetchListOfCourseStudents = async () => {
      const { data } = await axios.get<Student[]>(
        `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}/student`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
          },
        }
      );

      setStudents(data);
    };

    if (courseId) fetchListOfCourseStudents();
  }, [courseId]);

  const handleUpdateCourse = async () => {
    const { data } = await axios.patch(
      `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}`,
      {
        description: courseDescriptionToUpdate,
        rotate_qrcode_interval_seconds: courseQRRotateSecondsToUpdate,
        prevent_student_use_same_address: coursePreventSameIpToUpdate,
        attendance_rate: courseAttendanceRateToUpdate,
      },
      {
        headers: {
          authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
        },
      }
    );

    router.reload();
  };

  const handleSearchStudent = async () => {
    const url = !searchStudentText
      ? `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}/student`
      : `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}/student?search=${searchStudentText}`;

    const { data } = await axios.get(url, {
      headers: {
        authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
      },
    });
    setStudents(data);
  };

  return (
    <Layout>
      {course && (
        <>
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
            <div className="bg-white shadow-lg rounded-lg my-2 p-4">
              <div>
                <div className="px-4 sm:px-0">
                  <h3 className="text-xl font-semibold leading-7 text-gray-900">
                    Course Information
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
                        {course.course_code}
                      </dd>
                    </div>
                    <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Time
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {format(new Date(course.start_date), "dd MMMM yyyy")} ~{" "}
                        {format(new Date(course.end_date), "dd MMMM yyyy")}
                      </dd>
                    </div>
                    <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Schedules
                      </dt>
                      <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {schedulesByDayOfWeek.map((dayOfWeek) => (
                          <div key={dayOfWeek.dayOfWeek}>
                            <span className="w-full px-2 flex items-center gap-x-2 rounded-md font-medium text-blue-600 bg-blue-200">
                              <CalendarDaysIcon className="h-5 w-5" />
                              {dayOfWeek.dayOfWeek}
                            </span>
                            <div className="my-2 px-6">
                              <ol className="border-l border-neutral-300 dark:border-neutral-500">
                                {dayOfWeek.schedules.map((schedule) => (
                                  <li key={schedule.id}>
                                    <div className="flex-start flex items-center">
                                      <div className="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-blue-400"></div>
                                      <span className="ml-3 flex items-center gap-x-2">
                                        <ClockIcon className="h-5 w-5 text-black" />
                                        {formatTimeDisplay(
                                          schedule.start_hour,
                                          schedule.start_min
                                        )}{" "}
                                        -{" "}
                                        {formatTimeDisplay(
                                          schedule.end_hour,
                                          schedule.end_min
                                        )}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Attendance sessions
                      </dt>
                      <Link href={`/course/${course.id}/session`}>
                        <span className="w-fit flex items-center gap-x-2 text-sm text-white rounded-md px-2 py-1 bg-amber-400 hover:bg-amber-500 ">
                          <EyeIcon className="h-5 w-5" />
                          Show list of attendance session
                        </span>
                      </Link>
                    </div>
                    <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Description
                      </dt>
                      <textarea
                        name="description"
                        rows={3}
                        placeholder="About of this course..."
                        defaultValue={course.description}
                        onChange={(e) => {
                          e.preventDefault();
                          setCourseDescriptionToUpdate(e.target.value);
                        }}
                        className="mt-1 text-sm block w-full rounded-md border border-gray-300 py-1.5 text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-0 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:col-span-2 sm:mt-0"
                      />
                    </div>
                    <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Settings
                      </dt>
                      <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        <div className="flex items-center gap-x-2 mb-2">
                          <input
                            type="number"
                            defaultValue={course.rotate_qrcode_interval_seconds}
                            onChange={(e) =>
                              setCourseQRRotateSecondsToUpdate(
                                parseInt(e.target.value)
                              )
                            }
                            min={15}
                            className="block w-16 rounded-md border-0 py-1.5 text-sm text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          <span>seconds to rotate QR code</span>
                        </div>

                        <div className="flex items-center gap-x-2 mb-2">
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              if (coursePreventSameIpToUpdate === undefined)
                                setCoursePreventSameIpToUpdate(
                                  course.prevent_student_use_same_address === 1
                                    ? 0
                                    : 1
                                );
                              else
                                setCoursePreventSameIpToUpdate(
                                  coursePreventSameIpToUpdate === 1 ? 0 : 1
                                );
                            }}
                          >
                            {coursePreventSameIpToUpdate === undefined && (
                              <>
                                {course.prevent_student_use_same_address ===
                                  1 && (
                                  <div className="w-4 h-4 flex items-center justify-center rounded-md bg-blue-500 text-white">
                                    <CheckIcon className="w-3" />
                                  </div>
                                )}
                                {course.prevent_student_use_same_address ===
                                  0 && (
                                  <div className="w-4 h-4 flex items-center justify-center rounded-md border border-gray-300"></div>
                                )}
                              </>
                            )}

                            {coursePreventSameIpToUpdate !== undefined && (
                              <>
                                {coursePreventSameIpToUpdate === 1 && (
                                  <div className="w-4 h-4 flex items-center justify-center rounded-md bg-blue-500 text-white">
                                    <CheckIcon className="w-3" />
                                  </div>
                                )}
                                {coursePreventSameIpToUpdate === 0 && (
                                  <div className="w-4 h-4 flex items-center justify-center rounded-md border border-gray-300"></div>
                                )}
                              </>
                            )}
                          </div>
                          <span>
                            prevent student record with same ip address.
                          </span>
                        </div>

                        <div className="flex items-center gap-x-2 mb-2">
                          <input
                            type="number"
                            defaultValue={course.attendance_rate}
                            onChange={(e) =>
                              setCourseAttendanceRateToUpdate(
                                parseInt(e.target.value)
                              )
                            }
                            min={1}
                            className="block w-16 rounded-md border-0 py-1.5 text-sm text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          <span>
                            percent (%) - attendance rate for a student to be
                            considered pass.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pt-4 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={handleUpdateCourse}
                        className={classNames(
                          courseDescriptionToUpdate === undefined &&
                            courseQRRotateSecondsToUpdate === undefined &&
                            coursePreventSameIpToUpdate === undefined &&
                            courseAttendanceRateToUpdate === undefined
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-500",
                          "flex w-auto justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
                        )}
                      >
                        Save
                      </button>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mb-4 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="flex items-center gap-x-5">
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                List of students
              </h2>
              <button
                type="button"
                onClick={(e) => {
                  setShowListStudent(!showListStudent);
                }}
                className="flex items-center justify-center gap-x-2 rounded-lg bg-gray-400 px-3 py-0.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline-none"
              >
                {!showListStudent ? (
                  <EyeIcon className="w-4" />
                ) : (
                  <EyeSlashIcon className="w-4" />
                )}
                {!showListStudent ? "Show" : "Hidden"}
              </button>
            </div>

            <div
              className={classNames(
                !showListStudent ? "hidden ease-in" : "ease-out",
                "transition duration-150"
              )}
            >
              <div className="mt-4 flex justify-between items-center bg-gray-200 w-full h-16 px-4 rounded-t-lg border-solid border bor">
                <div className="flex items-center">
                  <div className="relative mx-2 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1">
                      <MagnifyingGlassIcon className="text-gray-500 h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      value={searchStudentText}
                      onChange={(e) => setSearchStudentText(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder="Search text..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSearchStudent}
                    className="inline-flex justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Search
                  </button>
                </div>
                {/* <div className="flex items-center">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    + Add student
                  </button>
                </div> */}
              </div>

              <div className="relative overflow-x-auto shadow-md">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Student code
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Email address
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Gender
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Phone number
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Age
                      </th>
                      {/* <th scope="col" className="px-6 py-3">
                        Actions
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <td className="px-6 py-3">{student.student_code}</td>
                        <td className="px-6 py-3">
                          {student.last_name} {student.first_name}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-x-2">
                            <EnvelopeIcon className="w-5 text-gray-500" />
                            {student.email}
                          </div>
                        </td>
                        <td className="px-6 py-3">{student.gender}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-x-2">
                            <DevicePhoneMobileIcon className="w-5 text-gray-500" />
                            {student.phone_number ?? "..."}
                          </div>
                        </td>
                        <td className="px-6 py-3">{student.age ?? "..."}</td>
                        {/* <td className="flex items-center px-6 py-4 space-x-3">
                          <Link
                            href={`#`}
                            target="_blank"
                            className="font-medium text-gray-950"
                          >
                            <div className="w-5 mr-1">
                              <QrCodeIcon />
                            </div>
                          </Link>

                          <Link
                            href={`#`}
                            className="font-medium text-blue-500"
                          >
                            <div className="w-5 mr-1">
                              <PlayIcon />
                            </div>
                          </Link>

                          <button className="font-medium text-red-400">
                            <div className="w-5 mr-1">
                              <TrashIcon />
                            </div>
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default CourseDetail;
