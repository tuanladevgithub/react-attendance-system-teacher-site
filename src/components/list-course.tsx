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

import Image from "next/image";
import { UsersIcon } from "@heroicons/react/24/solid";

const ListCourse = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Recent Courses Activity
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          <div key={1} className="group relative">
            <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75">
              <img
                src="https://www.itprotoday.com/sites/itprotoday.com/files/styles/article_featured_standard/public/programming%20evolution.jpg?itok=TnBIz21w"
                alt="Course image"
                className="object-cover object-center"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <a href="https://course.com/">
                    <span aria-hidden="true" className="absolute inset-0" />
                    Node.js crash course
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Programming</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                35 <UsersIcon className="h-5 w-5" aria-hidden="true" />
              </p>
            </div>
          </div>
          <div key={2} className="group relative">
            <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75">
              <img
                src="https://www.itprotoday.com/sites/itprotoday.com/files/styles/article_featured_standard/public/programming%20evolution.jpg?itok=TnBIz21w"
                alt="Course image"
                className="object-cover object-center"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <a href="https://course.com/">
                    <span aria-hidden="true" className="absolute inset-0" />
                    Python crash course
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Programming</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                35 <UsersIcon className="h-5 w-5" aria-hidden="true" />
              </p>
            </div>
          </div>
          <div key={3} className="group relative">
            <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75">
              <img
                src="https://www.itprotoday.com/sites/itprotoday.com/files/styles/article_featured_standard/public/programming%20evolution.jpg?itok=TnBIz21w"
                alt="Course image"
                className="object-cover object-center"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <a href="https://course.com/">
                    <span aria-hidden="true" className="absolute inset-0" />
                    Golang crash course
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Programming</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                35 <UsersIcon className="h-5 w-5" aria-hidden="true" />
              </p>
            </div>
          </div>
          <div key={4} className="group relative">
            <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75">
              <img
                src="https://www.itprotoday.com/sites/itprotoday.com/files/styles/article_featured_standard/public/programming%20evolution.jpg?itok=TnBIz21w"
                alt="Course image"
                className="object-cover object-center"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <a href="https://course.com/">
                    <span aria-hidden="true" className="absolute inset-0" />
                    Java crash course
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Programming</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                35 <UsersIcon className="h-5 w-5" aria-hidden="true" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCourse;
