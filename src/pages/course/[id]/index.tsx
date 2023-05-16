import Layout from "@/components/layout";
import {
  Cog8ToothIcon,
  PlayIcon,
  QrCodeIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const filterMenus = ["All", "Months", "Weeks", "Days"];

const attendanceSessions = [
  { id: 1, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 2, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 3, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 4, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 5, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 6, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 7, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 8, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },

  { id: 9, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 10, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 11, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 12, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 13, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 14, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 15, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
  { id: 16, date: "Thu 20 Apr 2023", time: "17:20AM - 18:00AM" },
];

const CourseAttendanceList = () => {
  const [currentFilter, setCurrentFilter] = useState("Weeks");

  return (
    <>
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between items-center bg-gray-200 w-full h-16 px-4 rounded-t-lg border-solid border bor">
            <div>
              <Link
                href={`/course/${1}/add-session`}
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
                      <label htmlFor="checkbox-all-search" className="sr-only">
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
                    <td className="w-44 px-6 py-4">{session.date}</td>
                    <td className="w-44 px-6 py-4">{session.time}</td>
                    <td className="w-36 px-6 py-4">All students</td>
                    <td className="px-6 py-4">Regular class session</td>
                    <td className="flex items-center px-6 py-4 space-x-3">
                      <Link href="#" className="font-medium text-gray-950">
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

                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CourseAttendanceList;
