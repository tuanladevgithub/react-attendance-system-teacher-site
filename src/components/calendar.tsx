import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { AttendanceSession } from "@/types/attendance-session.type";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
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
import { useEffect, useState } from "react";

const formatEventDisplay = (session: AttendanceSession) => {
  const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  return `${formatNumber(session.start_hour)}:${formatNumber(
    session.start_min
  )}~${formatNumber(session.end_hour)}:${formatNumber(session.end_min)} - ${
    session.course?.subject?.subject_code
  }`;
};

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const eventColors = [
  "emerald",
  "orange",
  "yellow",
  "lime",
  "green",
  "teal",
  "violet",
  "cyan",
  "indigo",
  "purple",
];

const dayTitles = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const today = startOfToday();

  const [currMonth, setCurrMonth] = useState(() => format(today, "MMM-yyyy"));
  const [dateSessions, setDateSessions] = useState<{
    [sessionDateProp: string]: AttendanceSession[];
  }>({});

  useEffect(() => {
    const fetchCurrentMonthSessions = async () => {
      const { data } = await axios.get(
        `${ATTENDANCE_API_DOMAIN}/teacher/current-month-sessions?currentYearMonth=${format(
          new Date(),
          "yyyy-MM"
        )}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      setDateSessions(data);
    };

    fetchCurrentMonthSessions();
  }, []);

  let firstDayOfMonth = parse(currMonth, "MMM-yyyy", new Date());
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
    setCurrMonth(format(firstDayOfPrevMonth, "MMM-yyyy"));
  };

  const getNextMonth = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setCurrMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
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
                                <div className="bottom flex-grow h-full py-1 w-full">
                                  {dateSessions[
                                    `${format(day, "yyyy-MM-dd")}`
                                  ].map((session: AttendanceSession) => (
                                    <div
                                      key={session.id}
                                      className="bg-teal-500 event text-white cursor-pointer rounded px-0.5 text-sm mb-1"
                                    >
                                      <span className="event-name">
                                        {formatEventDisplay(session)}
                                      </span>
                                    </div>
                                  ))}
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
    </div>
  );
};

export default Calendar;
