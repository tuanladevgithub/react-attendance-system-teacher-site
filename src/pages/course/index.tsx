import Layout from "@/components/layout";
import Image from "next/image";
import Link from "next/link";
import courseImg from "../../../public/course-img.jpg";
import {
  ClockIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Course, CourseSchedule } from "@/types/course.type";
import axios from "axios";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import Cookies from "js-cookie";
import emptyDataImg from "../../../public/empty_data_icon.svg";
import { format, getDay } from "date-fns";
import { formatTimeDisplay } from "@/utils/date-time-util";

const MyCourses = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [hasCourses, setHasCourses] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<CourseSchedule[]>([]);

  useEffect(() => {
    const fetchTodaySchedules = async () => {
      const { data } = await axios.get(
        `${ATTENDANCE_API_DOMAIN}/teacher/today-schedule`,
        {
          params: {
            today: format(new Date(), "yyyy-MM-dd"),
            dayOfWeek: getDay(new Date()),
          },
          headers: {
            authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      setTodaySchedules(data);
    };

    fetchTodaySchedules();
  }, []);

  useEffect(() => {
    const fetchListCourse = async () => {
      const { data } = await axios.get(
        `${ATTENDANCE_API_DOMAIN}/teacher/course`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      setCourses(data);
      setHasCourses(data.length > 0);
    };

    fetchListCourse();
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleSearchCourse = async () => {
    const url = !searchText
      ? `${ATTENDANCE_API_DOMAIN}/teacher/course`
      : `${ATTENDANCE_API_DOMAIN}/teacher/course?search=${searchText}`;

    const { data } = await axios.get(url, {
      headers: {
        authorization: `Bearer ${Cookies.get("access_token")}`,
      },
    });
    setCourses(data);
  };

  return (
    <>
      <Layout>
        {!hasCourses ? (
          <div className="mx-auto mt-40 w-full h-40 flex justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <div>
                <Image
                  className="h-auto w-auto"
                  src={emptyDataImg}
                  alt="Data empty to display"
                />
              </div>
              <div className="text-gray-500">There is no data to display.</div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={openModal}
                  className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  + New Course
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mx-auto max-w-2xl px-4 pt-8 lg:max-w-7xl lg:px-8">
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                {`Today schedules ~ ${format(new Date(), "eee dd MMM yyyy")}`}
              </h2>
              {!todaySchedules || todaySchedules.length < 1 ? (
                <div className="mx-auto mt-4 w-full h-fit flex justify-center items-center">
                  <div className="flex flex-col justify-center items-center">
                    <div>
                      <Image
                        className="h-16 w-auto"
                        src={emptyDataImg}
                        alt="Data empty to display"
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      There are no classes scheduled for today.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow-lg rounded-lg my-2 p-4">
                  <div className="px-6">
                    <ol className="border-l border-neutral-300">
                      {todaySchedules.map((schedule) => (
                        <li key={schedule.id}>
                          <div className="flex-start flex items-center pt-3">
                            <div className="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-blue-400"></div>
                            <span className="w-fit px-2 flex items-center gap-x-2 rounded-md text-sm text-blue-600 bg-blue-200">
                              <ClockIcon className="h-4 w-4" />
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
                          <div className="mb-2 ml-4 mt-2 px-2 cursor-pointer rounded-md hover:bg-slate-300">
                            <Link href={`/course/${schedule.course?.id}`}>
                              <h3 className="mb-1.5 text-base font-medium">
                                {schedule.course?.course_code} -{" "}
                                {schedule.course?.subject?.subject_code} -{" "}
                                {schedule.course?.subject?.subject_name}
                              </h3>
                              <p className="mb-3 text-sm text-neutral-500">
                                Students: {schedule.course?.countStudents}
                              </p>
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>

            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                List courses
              </h2>

              <div className="flex justify-between my-4">
                <div className="filter-group">
                  <div className="flex items-center justify-center">
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 sm:text-sm">
                        <MagnifyingGlassIcon className="w-5 h-5 text-opacity-100" />
                      </div>
                      <input
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 pl-10 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Search course..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearchCourse();
                          }
                        }}
                      />
                    </div>
                    <div className="mx-2">
                      <button
                        type="button"
                        onClick={handleSearchCourse}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>

                <div className="button-group flex justify-center items-center">
                  {/* <button
                    type="button"
                    onClick={openModal}
                    className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    + New Course
                  </button> */}
                </div>
              </div>

              {!courses || courses.length < 1 ? (
                <div className="mx-auto mt-20 w-full h-30 flex justify-center items-center">
                  <div className="flex flex-col justify-center items-center">
                    <div>
                      <Image
                        className="h-auto w-auto"
                        src={emptyDataImg}
                        alt="Data empty to display"
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      No courses found for your request.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                  {courses.map((course) => (
                    <div key={course.id} className="group relative">
                      <div className="bg-white w-full border-solid border rounded-lg">
                        <div className="aspect-h-1 aspect-w-2 w-full overflow-hidden rounded-t-lg bg-gray-200">
                          <Image
                            src={courseImg}
                            alt={`${course.subject?.subject_code} - ${course.course_code}`}
                            className="h-full w-full object-cover object-center group-hover:opacity-75"
                          />
                        </div>
                        <div className="my-1 px-2 flex justify-between">
                          <div>
                            <h3 className="text-base text-blue-500">
                              <Link href={`/course/${course.id}`}>
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-0"
                                />
                                {course.subject?.subject_name}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {`${course.subject?.subject_code} - ${course.course_code}`}
                            </p>
                          </div>
                          <div className="flex flex-col items-center justify-center text-sm font-medium text-gray-700">
                            <div className="mx-1">
                              <UsersIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </div>
                            <p>{course.countStudents}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Layout>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create new course
                  </Dialog.Title>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      TODO: Create form to add new course here!
                    </p>
                  </div>

                  <div className="mt-4 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                      onClick={closeModal}
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MyCourses;
