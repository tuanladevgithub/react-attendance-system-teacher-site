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
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Recent Courses Activity
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {mockRecentCourses.map((course) => {
            return (
              <div key={course.id} className="group relative">
                <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75">
                  <Image
                    src={courseImg}
                    alt="Course image"
                    className="object-cover object-center"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href="https://course.com/">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {course.course_name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{course.tag}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {course.students}
                    <UsersIcon className="h-5 w-5" aria-hidden="true" />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentCourses;
