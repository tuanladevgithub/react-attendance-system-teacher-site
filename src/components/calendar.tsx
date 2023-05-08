import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
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
import { useState } from "react";

function Calendar() {
  const today = startOfToday();
  const dayTitles = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [currMonth, setCurrMonth] = useState(() => format(today, "MMM-yyyy"));
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
    <div className="h-fit overflow-hidden flex items-center justify-center">
      <div>
        <div className="container mx-auto pt-10 pb-10">
          <div className="wrapper bg-white border-solid border w-full">
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
                            } p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-200 ease hover:bg-gray-300`}
                          >
                            <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                              <div className="top h-5 w-full flex items-center justify-center my-2">
                                <div
                                  className={
                                    isToday(day)
                                      ? "rounded-full w-6 text-white bg-red-500"
                                      : "text-gray-500"
                                  }
                                >
                                  <span>{format(day, "d")}</span>
                                </div>
                              </div>
                              <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer">
                                <div className="event bg-purple-400 text-white rounded p-1 text-sm mb-1">
                                  <span className="event-name"> Meeting </span>
                                  <span className="time"> 12:00~14:00 </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* <tr className="text-center h-20">
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">1</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer">
                        <div className="event bg-purple-400 text-white rounded p-1 text-sm mb-1">
                          <span className="event-name"> Meeting </span>
                          <span className="time"> 12:00~14:00 </span>
                        </div>
                        <div className="event bg-purple-400 text-white rounded p-1 text-sm mb-1">
                          <span className="event-name"> Meeting </span>
                          <span className="time"> 18:00~20:00 </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">2</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">3</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">4</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">6</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-hidden transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">7</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer">
                        <div className="event bg-blue-400 text-white rounded p-1 text-sm mb-1">
                          <span className="event-name"> Shopping </span>
                          <span className="time"> 12:00~14:00 </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500 text-sm">8</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                </tr> */}

                {/* <!--         line 1 --> */}
                {/* <tr className="text-center h-20">
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">9</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">10</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">12</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">13</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">14</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">15</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500 text-sm">16</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                </tr> */}
                {/* <!--         line 1 --> */}

                {/* <!--         line 2 --> */}
                {/* <tr className="text-center h-20">
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">16</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">17</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">18</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">19</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">20</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">21</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500 text-sm">22</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                </tr> */}
                {/* <!--         line 2 --> */}

                {/* <!--         line 3 --> */}
                {/* <tr className="text-center h-20">
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">23</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">24</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">25</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">26</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">27</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">28</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500 text-sm">29</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                </tr> */}
                {/* <!--         line 3 --> */}

                {/* <!--         line 4 --> */}
                {/* <tr className="text-center h-20">
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">30</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">31</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border bg-gray-100 p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">1</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border bg-gray-100 p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">2</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border bg-gray-100 p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">3</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border bg-gray-100 p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500">4</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                  <td className="border bg-gray-100 p-1 h-40 xl:w-40 lg:w-30 md:w-30 sm:w-20 w-10 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                    <div className="flex flex-col h-40 mx-auto xl:w-40 lg:w-30 md:w-30 sm:w-full w-10 overflow-hidden">
                      <div className="top h-5 w-full">
                        <span className="text-gray-500 text-sm">5</span>
                      </div>
                      <div className="bottom flex-grow h-30 py-1 w-full cursor-pointer"></div>
                    </div>
                  </td>
                </tr> */}
                {/* <!--         line 4 --> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
