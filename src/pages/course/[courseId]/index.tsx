import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { Course, CourseSchedule } from "@/types/course.type";
import { classNames } from "@/utils/class-name-util";
import { formatTimeDisplay } from "@/utils/date-time-util";
import {
  CalendarDaysIcon,
  ClockIcon,
  EyeIcon,
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
  const [schedulesByDayOfWeek, setSchedulesByDayOfWeek] = useState<
    { dayOfWeek: string; schedules: CourseSchedule[] }[]
  >([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      const { data } = await axios.get<Course>(
        `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("access_token")}`,
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

  const handleUpdateCourse = async () => {
    const { data } = await axios.patch(
      `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}`,
      { description: courseDescriptionToUpdate },
      {
        headers: {
          authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      }
    );

    router.reload();
  };

  return (
    <>
      {course && (
        <Layout>
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
            <div className="bg-white shadow-lg rounded-lg my-2 p-4">
              <div>
                <div className="px-4 sm:px-0">
                  <h3 className="text-xl font-semibold leading-7 text-gray-900">
                    Course Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                    Course details and application.
                  </p>
                </div>
                <div className="mt-6 border-t border-gray-100">
                  <dl className="divide-y divide-gray-200">
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Subject
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {course.subject?.subject_code} -{" "}
                        {course.subject?.subject_name}
                      </dd>
                    </div>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Teacher
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {course.teacher?.teacher_code} -{" "}
                        {course.teacher?.last_name} {course.teacher?.first_name}
                      </dd>
                    </div>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Course code
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {course.course_code}
                      </dd>
                    </div>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Time
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {format(new Date(course.start_date), "dd MMM yyyy")} ~{" "}
                        {format(new Date(course.end_date), "dd MMM yyyy")}
                      </dd>
                    </div>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
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
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
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
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
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
                        className="mt-1 text-sm block w-full rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:col-span-2 sm:mt-0"
                      />
                    </div>
                    <div className="px-4 pt-4 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={handleUpdateCourse}
                        className={classNames(
                          courseDescriptionToUpdate === undefined
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
        </Layout>
      )}
    </>
  );
};

export default CourseDetail;
