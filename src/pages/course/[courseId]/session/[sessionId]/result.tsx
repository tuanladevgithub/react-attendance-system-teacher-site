import Layout from "@/components/layout";
import Link from "next/link";

const SessionResult = () => {
  return (
    <>
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between items-center bg-gray-200 w-full h-16 px-4 rounded-t-lg border-solid border bor">
            <div>
              <Link
                href="#"
                className="flex w-full justify-center rounded-md bg-gray-700 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Back to list session
              </Link>
            </div>

            <div className="flex text-sm">
              <div className="mx-2">
                <span>Students: 20</span>
              </div>

              <div className="mx-2">
                <span>Present: 10</span>
              </div>

              <div className="mx-2">
                <span>Late: 2</span>
              </div>

              <div className="mx-2">
                <span>Excused: 0</span>
              </div>

              <div className="mx-2">
                <span>Absent: 0</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Student code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    First name / Last name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    P
                  </th>
                  <th scope="col" className="px-6 py-3">
                    E
                  </th>
                  <th scope="col" className="px-6 py-3">
                    L
                  </th>
                  <th scope="col" className="px-6 py-3">
                    A
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Remarks
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  // key={session.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4">20166916</td>
                  <td className="w-72 px-6 py-4">Le Anh Tuan</td>
                  <td className="w-72 px-6 py-4">
                    tuan.la166916@sis.hust.edu.vn
                  </td>
                  <td className="px-6 py-4">
                    <input type="radio" name="session-result" />
                  </td>
                  <td className="px-6 py-4">
                    <input type="radio" name="session-result" />
                  </td>
                  <td className="px-6 py-4">
                    <input type="radio" name="session-result" />
                  </td>
                  <td className="px-6 py-4">
                    <input type="radio" name="session-result" />
                  </td>
                  <td className="px-6 py-4 space-x-3">...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SessionResult;
