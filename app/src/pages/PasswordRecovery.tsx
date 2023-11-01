import { useState } from "react";
import { createContext } from "react";
import Login from "./Login";
import OTPResetEmail from "../components/ForgetPassword/ForgetPasswordEmail";
import OTPInput from "../components/ForgetPassword/OTPInput";
import ResetPassword from "../components/ForgetPassword/ResetPassword";


export const RecoveryContext = createContext<any>({} as any)
function ForgetPassword2() {
  const [page, setPage] = useState("otpemail");
  const [email, setEmail] = useState();
  const [otp, setOTP] = useState();

  function NavigateComponents() {
    if (page === "otpemail") return <OTPResetEmail />;
    if (page === "otpinput") return <OTPInput />;
    if (page === "reset") return <ResetPassword />;
    if (page === "login") return <Login />;

    return (
      <div>
          <section className="h-screen">
              <div className="px-6 h-full text-gray-800">
                  <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
                      <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
                          <img
                              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                              className="w-full"
                              alt=''
                          />
                      </div>
                      <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
                          <form>
                              <div className="flex flex-row items-center justify-center lg:justify-start">
                                  <h1 className="text-2xl font-bold mb-0 mr-4">
                                      Password successfully set{" "}
                                  </h1>
                              </div>
  
                  <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                    <h2>Welcome HOME </h2>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <RecoveryContext.Provider
      value={{ page, setPage, otp, setOTP, setEmail, email }}
    >
      <div className="flex justify-center items-center">
        <NavigateComponents />
      </div>
    </RecoveryContext.Provider>
  );
}

export default ForgetPassword2;
