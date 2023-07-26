import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { AttendanceSession } from "@/types/attendance-session.type";
import { Course } from "@/types/course.type";
import { formatTimeDisplay } from "@/utils/date-time-util";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import {
  AcademicCapIcon,
  Cog8ToothIcon,
  PlayIcon,
  QrCodeIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import Cookies from "js-cookie";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

const formatEventDisplay = (session: AttendanceSession) => {
  const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  return `${formatNumber(session.start_hour)}:${formatNumber(
    session.start_min
  )}~${formatNumber(session.end_hour)}:${formatNumber(session.end_min)} - ${
    session.course?.subject?.subject_code
  }`;
};

const eventColors = [
  "#10b981",
  "#f97316",
  "#84cc16",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#8b5cf6",
  "#06b6d4",
  "#6366f1",
  "#a855f7",
];

const dayTitles = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const today = startOfToday();
  const [currMonthToDisplay, setCurrMonthToDisplay] = useState(() =>
    format(today, "MMM-yyyy")
  );
  const [yearMonth, setYearMonth] = useState(() => format(today, "yyyy-MM"));
  const [dateSessions, setDateSessions] = useState<{
    [sessionDateProp: string]: AttendanceSession[];
  }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthSessions = async () => {
      if (Cookies.get("teacher_access_token")) {
        const { data } = await axios.get(
          `${ATTENDANCE_API_DOMAIN}/teacher/month-sessions?yearMonth=${yearMonth}`,
          {
            headers: {
              authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
            },
          }
        );
        setDateSessions(data);
      }
    };

    fetchMonthSessions();
  }, [yearMonth]);

  let firstDayOfMonth = parse(currMonthToDisplay, "MMM-yyyy", new Date());
  const listDays = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(endOfMonth(firstDayOfMonth)),
  });

  const listWeeks = [];
  while (listDays.length) {
    listWeeks.push(listDays.splice(0, 7));
  }

  const getPrevMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 });
    setCurrMonthToDisplay(format(firstDayOfPrevMonth, "MMM-yyyy"));
    setYearMonth(format(firstDayOfPrevMonth, "yyyy-MM"));
  };

  const getNextMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setCurrMonthToDisplay(format(firstDayOfNextMonth, "MMM-yyyy"));
    setYearMonth(format(firstDayOfNextMonth, "yyyy-MM"));
  };

  const getSessionsOfSelectedDate = () => {
    if (!selectedDate || !dateSessions[`${selectedDate}`]) return [];

    const sessions = dateSessions[`${selectedDate}`];
    const tmp: { course?: Course; sessions: AttendanceSession[] }[] = [];
    sessions.forEach((session) => {
      const idx = tmp.findIndex(
        (item) => item.course?.id === session.course?.id
      );

      if (idx !== -1) {
        tmp[idx] = { ...tmp[idx], sessions: [...tmp[idx].sessions, session] };
      } else {
        tmp.push({ course: session.course, sessions: [session] });
      }
    });

    return tmp;
  };

  return (
    <div>
      <div className="h-fit overflow-hidden flex items-center justify-center">
        <div className="container mx-auto max-w-2xl px-4 py-4 lg:max-w-7xl lg:px-8">
          <div className="bg-white border-solid border w-full">
            <div className="header flex justify-between border-b p-2">
              <span className="text-lg font-bold ml-4">
                {format(firstDayOfMonth, "MMMM yyyy")}
              </span>
              <div className="flex items-center justify-evenly gap-2">
                <ArrowLeftCircleIcon
                  className="w-6 h-6 cursor-pointer"
                  onClick={getPrevMonth}
                />
                <ArrowRightCircleIcon
                  className="w-6 h-6 cursor-pointer"
                  onClick={getNextMonth}
                />
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  {dayTitles.map((day) => {
                    return (
                      <th
                        key={day}
                        className="p-2 border-r h-10 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 xl:text-sm text-xs"
                      >
                        <span className="xl:block lg:block md:block sm:block hidden">
                          {day}
                        </span>
                        <span className="xl:hidden lg:hidden md:hidden sm:hidden block">
                          {day}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {listWeeks.map((week) => {
                  return (
                    <tr
                      key={`${week[0].getTime()}-${week[1].getTime()}`}
                      className="text-center h-20"
                    >
                      {week.map((day) => {
                        return (
                          <td
                            key={day.getTime()}
                            className={`border ${
                              !isSameMonth(day, firstDayOfMonth)
                                ? "bg-gray-100"
                                : ""
                            } h-[136px] xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition duration-100 ease hover:bg-gray-300`}
                          >
                            <div className="flex flex-col h-full mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-full overflow-hidden">
                              <div className="top h-4 w-full flex items-center justify-center my-2">
                                <div
                                  className={
                                    isToday(day)
                                      ? "rounded-full w-6 text-white bg-blue-500"
                                      : "text-gray-500"
                                  }
                                >
                                  <span>{format(day, "d")}</span>
                                </div>
                              </div>
                              {dateSessions[`${format(day, "yyyy-MM-dd")}`] && (
                                <div
                                  className="bottom cursor-pointer flex-grow h-full py-1 w-full"
                                  onClick={() =>
                                    setSelectedDate(format(day, "yyyy-MM-dd"))
                                  }
                                >
                                  {dateSessions[`${format(day, "yyyy-MM-dd")}`]
                                    .slice(0, 3)
                                    .map((session: AttendanceSession) => (
                                      <div
                                        key={session.id}
                                        style={{
                                          backgroundColor:
                                            eventColors[session.id % 10],
                                        }}
                                        className="event text-white rounded px-0.5 text-sm mb-1"
                                      >
                                        <span className="event-name">
                                          {formatEventDisplay(session)}
                                        </span>
                                      </div>
                                    ))}

                                  {dateSessions[`${format(day, "yyyy-MM-dd")}`]
                                    .length > 3 && (
                                    <div className="event text-white rounded px-0.5 text-sm mb-1">
                                      <span className="event-name text-gray-500 underline">
                                        show more{" "}
                                        {dateSessions[
                                          `${format(day, "yyyy-MM-dd")}`
                                        ].length - 3}{" "}
                                        items
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Transition.Root show={selectedDate !== null} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setSelectedDate(null)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="w-full">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          List of attendance sessions on{" "}
                          {format(
                            new Date(selectedDate ?? Date.now()),
                            "dd MMM yyyy"
                          )}
                        </Dialog.Title>
                        <div className="w-full mt-4">
                          {getSessionsOfSelectedDate().map((item) => (
                            <div key={item.course?.id} className="my-6">
                              <div className="flex items-center my-3 text-base text-gray-600 cursor-pointer">
                                <div className="w-5 mr-1">
                                  <AcademicCapIcon />
                                </div>
                                <Link href={`/course/${item.course?.id}`}>
                                  <span className="text-blue-600 hover:underline">
                                    {item.course?.subject?.subject_name} (
                                    {item.course?.subject?.subject_code} -{" "}
                                    {item.course?.course_code})
                                  </span>
                                </Link>
                              </div>

                              <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                                  <tr>
                                    <th scope="col" className="px-6 py-3">
                                      Time
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                      Overtime
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
                                  {item.sessions.map((session) => (
                                    <tr
                                      key={session.id}
                                      className="bg-white border-b hover:bg-gray-100"
                                    >
                                      <td className="px-6 py-4">{`${formatTimeDisplay(
                                        session.start_hour,
                                        session.start_min
                                      )} - ${formatTimeDisplay(
                                        session.end_hour,
                                        session.end_min
                                      )}`}</td>
                                      <td className="px-6 py-4">
                                        {!session.overtime_minutes_for_late
                                          ? "..."
                                          : `${session.overtime_minutes_for_late} mins`}
                                      </td>
                                      <td className="px-6 py-4">
                                        All students
                                      </td>
                                      <td className="px-6 py-4">
                                        {session.description}
                                      </td>
                                      <td className="flex items-center px-6 py-4 space-x-3">
                                        <Link
                                          href={`/course/${session.t_course_id}/session/${session.id}/qr-code`}
                                          target="_blank"
                                          className="font-medium text-gray-950"
                                        >
                                          <div className="w-5 mr-1">
                                            <QrCodeIcon />
                                          </div>
                                        </Link>

                                        <Link
                                          href={`/course/${session.t_course_id}/session/${session.id}/result`}
                                          target="_blank"
                                          className="font-medium text-blue-500"
                                        >
                                          <div className="w-5 mr-1">
                                            <PlayIcon />
                                          </div>
                                        </Link>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 sm:flex items-center justify-center sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setSelectedDate(null)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default Calendar;
