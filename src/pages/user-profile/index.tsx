import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { Teacher } from "@/types/teacher.type";
import { classNames } from "@/utils/class-name-util";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserProfile = () => {
  const router = useRouter();

  const [teacher, setTeacher] = useState<Teacher>();
  const [firstNameUpdate, setFirstNameUpdate] = useState<string>();
  const [lastNameUpdate, setLastNameUpdate] = useState<string>();
  const [phoneNumberUpdate, setPhoneNumberUpdate] = useState<string>();
  const [descriptionUpdate, setDescriptionUpdate] = useState<string>();
  const [showCurPass, setShowCurPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [curPass, setCurPass] = useState<string>();
  const [newPass, setNewPass] = useState<string>();

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      const { data } = await axios.get<Teacher>(
        `${ATTENDANCE_API_DOMAIN}/teacher/get-info`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
          },
        }
      );
      setTeacher(data);
    };

    fetchTeacherInfo();
  }, []);

  const handleUpdateInfo = async () => {
    if (firstNameUpdate || lastNameUpdate) {
      await axios.patch(
        `${ATTENDANCE_API_DOMAIN}/teacher/update-info`,
        {
          first_name: firstNameUpdate,
          last_name: lastNameUpdate,
          phone_number: phoneNumberUpdate,
          description: descriptionUpdate,
        },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
          },
        }
      );

      router.reload();
    }
  };

  const handleChangePassword = async () => {
    if (curPass && newPass) {
      try {
        await axios.post(
          `${ATTENDANCE_API_DOMAIN}/teacher/change-password`,
          {
            curPass,
            newPass,
          },
          {
            headers: {
              authorization: `Bearer ${Cookies.get("teacher_access_token")}`,
            },
          }
        );

        Cookies.remove("teacher_access_token");
        router.reload();
      } catch (error) {
        setCurPass(undefined);
        setNewPass(undefined);

        const { response } = error as AxiosError<{
          error: string;
          message: string;
          statusCode: number;
        }>;

        if (response?.status === 400)
          toast.error(response.data.message, {
            position: "bottom-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
      }
    }
  };

  return (
    <>
      <Layout>
        {teacher && (
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <form>
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Your Information
                    </h2>
                    {/* <p className="mt-1 text-sm leading-6 text-gray-600">
                    Use a permanent address where you can receive mail.
                  </p> */}

                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-8">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          First name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            value={firstNameUpdate ?? teacher.first_name}
                            onChange={(e) => {
                              e.preventDefault();
                              setFirstNameUpdate(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Last name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="last-name"
                            id="last-name"
                            value={lastNameUpdate ?? teacher.last_name}
                            onChange={(e) => {
                              e.preventDefault();
                              setLastNameUpdate(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            disabled
                            id="email"
                            name="email"
                            type="email"
                            value={teacher.email}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-900 disabled:border-slate-200 disabled:shadow-none"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="phone_number"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Phone number
                        </label>
                        <div className="mt-2">
                          <input
                            id="phone_number"
                            name="phone_number"
                            type="text"
                            value={phoneNumberUpdate ?? teacher.phone_number}
                            onChange={(e) => {
                              e.preventDefault();
                              setPhoneNumberUpdate(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="teacher_code"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Teacher code
                        </label>
                        <div className="mt-2">
                          <input
                            disabled
                            type="text"
                            name="teacher_code"
                            id="teacher_code"
                            value={teacher.teacher_code}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-900 disabled:border-slate-200 disabled:shadow-none"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="department"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Department
                        </label>
                        <div className="mt-2">
                          <select
                            disabled
                            id="department"
                            name="department"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-900 disabled:border-slate-200 disabled:shadow-none"
                          >
                            <option selected>
                              {teacher.department?.department_name}
                            </option>
                            <option>Department 2</option>
                            <option>Department 3</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-full">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Description
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={descriptionUpdate ?? teacher.description}
                            onChange={(e) => {
                              e.preventDefault();
                              setDescriptionUpdate(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          Write a few sentences about yourself.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      setFirstNameUpdate(undefined);
                      setLastNameUpdate(undefined);
                      setPhoneNumberUpdate(undefined);
                      setDescriptionUpdate(undefined);
                    }}
                    className={classNames(
                      !firstNameUpdate &&
                        !lastNameUpdate &&
                        !phoneNumberUpdate &&
                        !descriptionUpdate
                        ? "hidden"
                        : "",
                      "text-sm font-semibold leading-6 text-gray-900"
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateInfo}
                    className={classNames(
                      !firstNameUpdate &&
                        !lastNameUpdate &&
                        !phoneNumberUpdate &&
                        !descriptionUpdate
                        ? "bg-slate-500 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600",
                      "rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    )}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 mt-8">
              <form>
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Password setting
                    </h2>
                    {/* <p className="mt-1 text-sm leading-6 text-gray-600">
                    Use a permanent address where you can receive mail.
                  </p> */}

                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-8">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="cur_pass"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Current password
                        </label>
                        <div className="relative mt-2">
                          <input
                            type={!showCurPass ? "password" : "text"}
                            name="cur_pass"
                            id="cur_pass"
                            value={curPass}
                            onChange={(e) => {
                              e.preventDefault();
                              setCurPass(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />

                          <button
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowCurPass(!showCurPass);
                            }}
                          >
                            {showCurPass ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="sm:col-span-3"></div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="new_pass"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          New password
                        </label>
                        <div className="relative mt-2">
                          <input
                            type={!showNewPass ? "password" : "text"}
                            name="new_pass"
                            id="new_pass"
                            value={newPass}
                            onChange={(e) => {
                              e.preventDefault();
                              setNewPass(e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />

                          <button
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowNewPass(!showNewPass);
                            }}
                          >
                            {showNewPass ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="sm:col-span-3"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-x-6">
                  <button
                    type="button"
                    className={classNames(
                      !curPass || !newPass
                        ? "bg-slate-500 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600",
                      "rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    )}
                    onClick={handleChangePassword}
                  >
                    Change password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default UserProfile;
