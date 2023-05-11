/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/

import { UsersIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import courseImg from "../../public/course-img.jpg";
import Link from "next/link";

const mockRecentCourses = [
  {
    id: 1,
    course_name: "Node.js crash course",
    tag: "Programming",
    students: 20,
  },
  {
    id: 2,
    course_name: "Node.js crash course",
    tag: "Programming",
    students: 20,
  },
  {
    id: 3,
    course_name: "Node.js crash course",
    tag: "Programming",
    students: 20,
  },
  {
    id: 4,
    course_name: "Node.js crash course",
    tag: "Programming",
    students: 20,
  },
];

const RecentCourses = () => {
  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-4 lg:max-w-7xl lg:px-8">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">
          Recent Courses Activity
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {mockRecentCourses.map((course) => (
            <div key={course.id} className="group relative">
              <div className="bg-white w-full border-solid border rounded-lg">
                <div className="aspect-h-1 aspect-w-2 w-full overflow-hidden rounded-t-lg bg-gray-200">
                  <Image
                    src={courseImg}
                    alt={"Image alt"}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <div className="my-1 px-2 flex justify-between">
                  <div>
                    <h3 className="text-base text-blue-500">
                      <Link href={`/course/${course.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {course.course_name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      IT4996 - 765432
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center text-sm font-medium text-gray-700">
                    <div className="mx-1">
                      <UsersIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <p>24</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentCourses;
