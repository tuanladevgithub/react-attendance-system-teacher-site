import Layout from "@/components/layout";
import Image from "next/image";
import Link from "next/link";

import courseImg from "../../../public/course-img.jpg";
import { MagnifyingGlassIcon, UsersIcon } from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Course } from "@/types/course.type";
import axios from "axios";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import Cookies from "js-cookie";

const MyCourses = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchListCourse = async () => {
      const { data } = await axios.get(
        `${ATTENDANCE_API_DOMAIN}/teacher/list-course`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      setCourses(data);
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
      ? `${ATTENDANCE_API_DOMAIN}/teacher/list-course`
      : `${ATTENDANCE_API_DOMAIN}/teacher/list-course?search=${searchText}`;

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
        <div>
          <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">My courses</h2>

            <div className="flex justify-between my-4">
              <div className="filter-group">
                <div className="flex items-center justify-center">
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 sm:text-sm">
                      <MagnifyingGlassIcon className="w-5 h-5 text-opacity-100" />
                    </div>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      className="block w-full rounded-md border-0 py-1.5 pl-10 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Search course..."
                      onChange={(e) => setSearchText(e.target.value)}
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
                <button
                  type="button"
                  onClick={openModal}
                  className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  + New Course
                </button>
              </div>
            </div>

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
                          <UsersIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <p>{course.countStudents}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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