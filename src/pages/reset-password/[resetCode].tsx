/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

import Image from "next/image";
import logoImg from "../../../public/logo.svg";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import spinnerImg from "../../../public/oval.svg";
import { classNames } from "@/utils/class-name-util";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const router = useRouter();
  const [newPass, setNewPass] = useState<string>();
  const [newPassConfirm, setNewPassConfirm] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorOccur, setErrorOccur] = useState<string>();

  const handleResetPassword = async () => {
    setLoading(true);
    if (newPass && newPassConfirm && newPass === newPassConfirm) {
      try {
        await axios.patch(
          `${ATTENDANCE_API_DOMAIN}/auth/reset-password-teacher/${router.query.resetCode}`,
          {
            newPass,
          }
        );

        toast.success("Change password successfully!", {
          position: "bottom-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        await router.push("/sign-in");
      } catch (error: any) {
        setErrorOccur(error.response.data.message);
      }
    } else {
      setErrorOccur("Check your password and confirm");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-20 w-auto"
            src={logoImg}
            alt="Logo HUST"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Reset your password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {errorOccur && (
            <span className="text-sm text-red-500 italic">* {errorOccur}</span>
          )}
          <form className="space-y-6">
            <div>
              <label
                htmlFor="newPass"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                New password
              </label>
              <div className="mt-2">
                <input
                  id="newPass"
                  name="newPass"
                  type="password"
                  required
                  placeholder="*********"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="newPassConfirm"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm password
              </label>
              <div className="mt-2">
                <input
                  id="newPassConfirm"
                  name="newPassConfirm"
                  type="password"
                  required
                  placeholder="*********"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setNewPassConfirm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                className={classNames(
                  loading
                    ? "bg-slate-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500",
                  "flex w-full justify-center items-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                )}
                onClick={handleResetPassword}
              >
                {loading && (
                  <div className="mr-2">
                    <Image
                      className="h-5 w-auto"
                      src={spinnerImg}
                      alt="Spinner"
                    />
                  </div>
                )}
                <span>Reset Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
