import Layout from "@/components/layout";
import { Fragment, useState } from "react";
import {
  CalendarDaysIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import Collapse from "@kunukn/react-collapse";
import ReactDatePicker from "react-datepicker";
import { Listbox, Transition } from "@headlessui/react";
import {
  LIST_DAYS_OF_WEEK,
  LIST_HOURS,
  LIST_MINS,
} from "@/constants/common-constant";
import { useRouter } from "next/router";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { AttendanceSession } from "@/types/attendance-session.type";

const AddSession = () => {
  const router = useRouter();
  const courseId = router.query.courseId;
  const [addSessionError, setAddSessionError] = useState<string>();
  const [disclosureState, setDisclosureState] = useState<boolean[]>([
    true,
    false,
    false,
  ]);
  const [sessionDate, setSessionDate] = useState<Date>(new Date());
  const [sessionStartHour, setSessionStartHour] = useState<string>("08");
  const [sessionStartMin, setSessionStartMin] = useState<string>("00");
  const [sessionEndHour, setSessionEndHour] = useState<string>("09");
  const [sessionEndMin, setSessionEndMin] = useState<string>("00");
  const [sessionOvertimeMinutesForLate, setSessionOvertimeMinutesForLate] =
    useState<number>();
  const [sessionPassword, setSessionPassword] = useState<string>();
  const [sessionDescription, setSessionDescription] = useState<string>();
  const [repeatUtilDate, setRepeatUtilDate] = useState<Date>(new Date());

  const handleToggleBlock = (index: number) => {
    const newDisclosureState = [...disclosureState];
    newDisclosureState[index] = !newDisclosureState[index];
    setDisclosureState(newDisclosureState);
  };

  const handleChangeSessionDate = (date: Date) => {
    setSessionDate(date);
  };

  const handleChangeRepeatUtilDate = (date: Date) => {
    setRepeatUtilDate(date);
  };

  const handleCreateAttendanceSession = async () => {
    const url = `${ATTENDANCE_API_DOMAIN}/teacher/course/${courseId}/add-session`;

    try {
      await axios.post<AttendanceSession>(
        url,
        {
          session_date: format(sessionDate, "yyyy-MM-dd"),
          start_hour: parseInt(sessionStartHour),
          start_min: parseInt(sessionStartMin),
          end_hour: parseInt(sessionEndHour),
          end_min: parseInt(sessionEndMin),
          overtime_minutes_for_late: sessionOvertimeMinutesForLate,
          password: sessionPassword,
          description: sessionDescription,
        },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
          },
        }
      );

      router.push(`/course/${courseId}/session`);
    } catch (error: any) {
      const { response } = error as AxiosError<{
        error: string;
        message: string;
        statusCode: number;
      }>;

      if (response?.status === 400) setAddSessionError(response.data.message);
    }
  };

  return (
    <>
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
          <div className="bg-white w-full p-4 rounded-lg border-solid border shadow-md">
            <div>
              <span className="text-sm text-red-500 italic">
                {addSessionError}
              </span>
            </div>
            <div className="w-full flex justify-end text-sm cursor-pointer">
              <p
                onClick={() => setDisclosureState([true, true, true])}
                className={
                  disclosureState.every((s) => s === true)
                    ? "px-2 text-gray-500 cursor-not-allowed"
                    : "px-2 text-indigo-500 hover:underline"
                }
              >
                Expand all
              </p>
              <p
                onClick={() => setDisclosureState([false, false, false])}
                className={
                  disclosureState.every((s) => s === false)
                    ? "px-2 text-gray-500 cursor-not-allowed"
                    : "px-2 text-indigo-500 hover:underline"
                }
              >
                Collapse all
              </p>
            </div>

            {/* Block 1 */}
            <div className="mt-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleBlock(0);
                }}
                className="flex w-full justify-between rounded-lg bg-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
              >
                <span>ADD SESSION</span>
                <ChevronUpIcon
                  className={`${
                    disclosureState[0] ? "rotate-180 transform" : ""
                  } h-5 w-5 text-gray-500`}
                />
              </button>
              <Collapse
                isOpen={disclosureState[0]}
                className="text-sm text-gray-800"
              >
                <div className="px-4 pt-4 pb-2">
                  <div className="my-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <div className="font-medium">Type</div>
                    <div className="sm:col-span-2 sm:mt-0">
                      All students (Default)
                    </div>
                  </div>

                  <div className="my-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <div className="font-medium">Session date (*)</div>
                    <div className="sm:col-span-2 sm:mt-0">
                      <div className="flex justify-start items-center">
                        <div className="w-fit">
                          <ReactDatePicker
                            className="block w-auto rounded-md border-0 py-1.5 text-sm text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            selected={sessionDate}
                            onChange={handleChangeSessionDate}
                            dateFormat={"dd MMMM yyyy"}
                            // showIcon={true}
                            placeholderText="Select date..."
                          />
                        </div>

                        <div className="mx-1 w-5">
                          <CalendarDaysIcon />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="my-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <div className="font-medium">Time (*)</div>
                    <div className="sm:col-span-2 sm:mt-0">
                      <div className="w-full lg:w-1/2 flex justify-between items-center">
                        <div className="w-16">
                          <Listbox
                            value={sessionStartHour}
                            onChange={setSessionStartHour}
                          >
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full rounded-md border-0 py-1.5 pl-3 text-sm text-left text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                <span className="block truncate">
                                  {sessionStartHour}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute mt-1 max-h-24 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {LIST_HOURS.filter(
                                    (hour) =>
                                      parseInt(hour) <= parseInt(sessionEndHour)
                                  ).map((hour) => (
                                    <Listbox.Option
                                      key={hour}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-3 pr-4 ${
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-900"
                                        }`
                                      }
                                      value={hour}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {hour}
                                          </span>
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>

                        <div className="w-16">
                          <Listbox
                            value={sessionStartMin}
                            onChange={setSessionStartMin}
                          >
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full rounded-md border-0 py-1.5 pl-3 text-sm text-left text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                <span className="block truncate">
                                  {sessionStartMin}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute mt-1 max-h-24 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {LIST_MINS.filter(
                                    (min) =>
                                      parseInt(sessionStartHour) <
                                        parseInt(sessionEndHour) ||
                                      parseInt(min) <= parseInt(sessionEndMin)
                                  ).map((min) => (
                                    <Listbox.Option
                                      key={min}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-3 pr-4 ${
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-900"
                                        }`
                                      }
                                      value={min}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {min}
                                          </span>
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>

                        <div>
                          <span>to</span>
                        </div>

                        <div className="w-16">
                          <Listbox
                            value={sessionEndHour}
                            onChange={setSessionEndHour}
                          >
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full rounded-md border-0 py-1.5 pl-3 text-sm text-left text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                <span className="block truncate">
                                  {sessionEndHour}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute mt-1 max-h-24 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {LIST_HOURS.filter(
                                    (hour) =>
                                      parseInt(hour) >=
                                      parseInt(sessionStartHour)
                                  ).map((hour) => (
                                    <Listbox.Option
                                      key={hour}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-3 pr-4 ${
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-900"
                                        }`
                                      }
                                      value={hour}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {hour}
                                          </span>
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>

                        <div className="w-16">
                          <Listbox
                            value={sessionEndMin}
                            onChange={setSessionEndMin}
                          >
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full rounded-md border-0 py-1.5 pl-3 text-sm text-left text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                <span className="block truncate">
                                  {sessionEndMin}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute mt-1 max-h-24 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {LIST_MINS.filter(
                                    (min) =>
                                      parseInt(sessionStartHour) <
                                        parseInt(sessionEndHour) ||
                                      parseInt(min) >= parseInt(sessionStartMin)
                                  ).map((min) => (
                                    <Listbox.Option
                                      key={min}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-3 pr-4 ${
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-900"
                                        }`
                                      }
                                      value={min}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {min}
                                          </span>
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="my-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <div className="font-medium">Overtime minutes</div>
                    <div className="sm:col-span-2 sm:mt-0">
                      <div className="flex justify-start items-center gap-x-2">
                        <input
                          id="session_overtime"
                          name="session_overtime"
                          type="number"
                          value={sessionOvertimeMinutesForLate}
                          onChange={(e) =>
                            setSessionOvertimeMinutesForLate(
                              !e.target.value
                                ? undefined
                                : parseInt(e.target.value)
                            )
                          }
                          min={1}
                          className="block w-16 rounded-md border-0 py-1.5 text-sm text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />

                        <span>minutes</span>
                      </div>
                    </div>
                  </div>

                  <div className="my-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <div className="font-medium">Password</div>
                    <div className="sm:col-span-2 sm:mt-0">
                      <input
                        id="session_pass"
                        name="session_pass"
                        type="text"
                        value={sessionPassword}
                        onChange={(e) => setSessionPassword(e.target.value)}
                        className="block w-full lg:w-1/2 rounded-md border-0 py-1.5 text-sm text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Set attendance session password..."
                      />
                    </div>
                  </div>

                  <div className="my-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <div className="font-medium">Description</div>
                    <div className="sm:col-span-2 sm:mt-0">
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={"Regular class session"}
                        placeholder="Enter session description here..."
                        onChange={(e) => setSessionDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
            {/* End Block 1 */}

            {/* Block 2 */}
            <div className="mt-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleBlock(1);
                }}
                className="flex w-full justify-between rounded-lg bg-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
              >
                <span>MULTIPLE SESSION</span>
                <ChevronUpIcon
                  className={`${
                    disclosureState[1] ? "rotate-180 transform" : ""
                  } h-5 w-5 text-gray-500`}
                />
              </button>
              <Collapse
                isOpen={disclosureState[1]}
                className="text-sm text-gray-800"
              >
                <div className="px-4 pt-4 pb-2">
                  <div className="w-full flex flex-row items-start mb-3">
                    <div className="basis-1/4">Repeat on</div>
                    <div className="basis-3/4 flex items-center">
                      <ul className="items-center w-full bg-white rounded-lg sm:flex">
                        {LIST_DAYS_OF_WEEK.map((item) => (
                          <li key={item} className="w-full">
                            <div className="flex items-center">
                              <input
                                id={"vue-checkbox-list" + item}
                                type="checkbox"
                                value={item}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                              />
                              <label
                                htmlFor={"vue-checkbox-list" + item}
                                className="w-full py-3 ml-2"
                              >
                                {item}
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="w-full flex flex-row items-start mb-3">
                    <div className="basis-1/4">Repeat every</div>
                    <div className="basis-3/4 flex items-center">
                      <div className="mr-1">
                        <input
                          id="day"
                          name="day"
                          type="number"
                          min={1}
                          className="block w-16 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="mx-1">
                        <span>weeks</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex flex-row items-start mb-3">
                    <div className="basis-1/4">Repeat util</div>
                    <div className="basis-3/4">
                      <div className="flex justify-start items-center">
                        <div className="w-fit">
                          <ReactDatePicker
                            className="block w-auto rounded-md border-0 py-1.5 text-sm text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            selected={repeatUtilDate}
                            onChange={handleChangeRepeatUtilDate}
                            dateFormat={"dd-MM-yyyy"}
                            // showIcon={true}
                            placeholderText="Select date..."
                          />
                        </div>

                        <div className="mx-1 w-5">
                          <CalendarDaysIcon />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
            {/* End Block 2 */}

            {/* Block 3 */}
            <div className="mt-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleBlock(2);
                }}
                className="flex w-full justify-between rounded-lg bg-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75"
              >
                <span>STUDENT RECORDING</span>
                <ChevronUpIcon
                  className={`${
                    disclosureState[2] ? "rotate-180 transform" : ""
                  } h-5 w-5 text-gray-500`}
                />
              </button>
              <Collapse
                isOpen={disclosureState[2]}
                className="text-sm text-gray-800"
              >
                <div className="px-4 pt-4 pb-2">
                  <p>TODO:</p>
                </div>
              </Collapse>
            </div>
            {/* End Block 3 */}

            <div className="mt-4 px-4 py-3 flex justify-center items-center sm:px-6">
              <button
                type="button"
                onClick={handleCreateAttendanceSession}
                className="inline-flex w-full justify-center rounded-md bg-green-600 mx-1 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
              >
                Create
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/course/${courseId}/session`);
                }}
                className="inline-flex w-full justify-center rounded-md bg-white mx-1 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AddSession;
