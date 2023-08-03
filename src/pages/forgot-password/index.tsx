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
import axios from "axios";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import spinnerImg from "../../../public/oval.svg";
import { classNames } from "@/utils/class-name-util";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [errorOccur, setErrorOccur] = useState(null);

  const handleSendResetCode = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${ATTENDANCE_API_DOMAIN}/auth/send-reset-code-teacher`,
        {
          email,
        }
      );

      toast.info(
        "You will receive a reset email if user with that email exits.",
        {
          position: "bottom-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        }
      );
    } catch (error: any) {
      setErrorOccur(error.response.data.message);
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
            Forgot password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {errorOccur && (
            <span className="text-sm text-red-500 italic">* {errorOccur}</span>
          )}
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="sample@example.com"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setEmail(e.target.value)}
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
                onClick={handleSendResetCode}
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
                <span>Send Reset Code</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
