import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import ForgetPassword from "./ForgetPassword";
import { Button } from "../ui/button";

const SignInForm = ({ onBack }) => {
 const [showPassword, setShowPassword] = useState(false);
 const [keepLoggedIn, setKeepLoggedIn] = useState(false);
 const [showForgetForm, setForgetForm] = useState(false);
 const navigate = useNavigate();
 const SignInFormComponent = () => {
  return (
   <div className="md:w-[45%] w-[100%] bg-white px-4 sm:px-10 md:px-12 lg:px-14 pt-20  flex flex-col">
    <div className="w-full max-w-sm  mx-auto">
     <Link to={"/"}>
      <svg
       className="mb-[50px]"
       width="135"
       height="24"
       viewBox="0 0 135 24"
       fill="none"
       xmlns="http://www.w3.org/2000/svg">
       <path
        d="M114.561 4.81772V0.858627C114.561 0.420675 114.208 0.0703125 113.766 0.0703125H96.7595C96.318 0.0703125 95.9648 0.420675 95.9648 0.858627V4.01189C95.9648 4.44984 96.318 4.8002 96.7595 4.8002H101.863C102.305 4.8002 102.658 5.15056 102.658 5.58852V22.6687C102.658 23.4044 103.258 24 104 24H106.543C107.285 24 107.885 23.4044 107.885 22.6687V5.58852C107.885 5.15056 108.239 4.8002 108.68 4.8002L114.561 4.81772Z"
        fill="#054A86"
       />
       <path
        d="M64.1591 0.0878906C57.8898 0.157963 54.8876 3.94187 54.8522 9.82796C54.7993 10.9842 54.7993 13.0863 54.8522 14.26C54.9229 15.7666 55.0112 16.9929 55.488 18.3768C56.6889 22.2308 60.1679 23.9826 64.1591 24.0001C68.1503 24.0001 71.6293 22.2483 72.8302 18.3768C73.3071 16.9929 73.3954 15.7666 73.466 14.26C73.519 13.1038 73.519 11.0017 73.466 9.82796C73.4307 3.94187 70.4285 0.157963 64.1591 0.0878906ZM68.2033 15.0308C68.0797 17.4308 66.8435 19.2702 64.1591 19.2352C61.4924 19.2702 60.2386 17.4308 60.115 15.0308C59.9913 13.5243 60.0267 11.9652 60.0443 10.4061C60.0796 9.26738 60.1149 8.35644 60.4152 7.37542C60.9626 5.7112 62.3048 4.80026 64.1591 4.81778C66.0134 4.80026 67.3556 5.7112 67.9031 7.37542C68.2033 8.35644 68.2386 9.26738 68.2739 10.4061C68.2916 11.9476 68.3269 13.5243 68.2033 15.0308Z"
        fill="#054A86"
       />
       <path
        d="M92.8742 11.8598C91.6203 10.7387 89.7483 10.0204 87.2759 9.70508L86.022 9.5299C84.6445 9.35472 83.6909 9.0394 83.1434 8.61896C81.9955 7.77809 82.1015 6.0438 83.1258 5.18541C83.6556 4.71243 84.4503 4.46717 85.5099 4.46717C87.5761 4.46717 89.2892 5.11534 91.0375 6.2365C91.2318 6.34161 91.3907 6.32409 91.532 6.13139L93.6512 3.01317C93.8101 2.80295 93.7925 2.64529 93.5806 2.50514C90.5254 0.262827 85.7042 -0.543006 82.0132 0.595671C80.0353 1.24384 78.4812 2.41755 77.6511 4.25695C76.5386 6.65693 76.9801 10.3708 78.9933 11.9474C80.2825 13.0686 82.1545 13.7868 84.5739 14.1021L85.8278 14.2773C87.2582 14.4525 88.2119 14.7678 88.724 15.1883C89.8719 16.1167 89.6953 17.6057 88.5121 18.4466C87.011 19.6028 83.8852 19.3225 82.1721 18.4817C81.1302 17.9911 80.1942 17.4481 79.4172 16.835C79.2052 16.6773 79.0286 16.6948 78.8873 16.87L76.203 20.2335C76.0441 20.4437 76.0441 20.6364 76.2383 20.8116C78.6401 22.9313 82.1368 23.9473 85.4039 23.9823C89.0243 23.9999 92.6622 22.8787 94.1457 19.6028C95.2936 17.1853 94.8168 13.4364 92.8742 11.8598Z"
        fill="#054A86"
       />
       <path
        d="M126.799 0.403096C126.729 0.175361 126.57 0.0527344 126.34 0.0527344H121.855C121.625 0.0527344 121.466 0.175361 121.395 0.403096L113.077 23.6321C113.007 23.8598 113.095 23.9825 113.325 23.9825H117.987C118.217 23.9825 118.375 23.8598 118.446 23.6321L119.682 19.8482C119.806 19.4803 120.141 19.2175 120.548 19.2175H127.541C127.93 19.2175 128.283 19.4628 128.406 19.8307L129.643 23.6146C129.713 23.8423 129.872 23.9649 130.102 23.9649H134.729C134.958 23.9649 135.047 23.8423 134.976 23.6146L126.799 0.403096ZM125.598 15.0482H122.508C121.89 15.0482 121.466 14.4526 121.643 13.8745L123.991 6.67458H124.097L126.446 13.8745C126.658 14.4526 126.217 15.0482 125.598 15.0482Z"
        fill="#054A86"
       />
       <path
        d="M42.4021 0.0878906H36.9451C35.0025 0.0878906 33.4131 1.71707 33.4131 3.73166V24.0001H42.4021C44.4507 24.0001 46.1637 23.5622 47.5235 22.6687C48.8833 21.7753 49.8547 20.4264 50.4198 18.622C51.0555 16.4498 51.0202 14.4878 51.0379 12.0528C51.0202 9.61774 51.0555 7.65571 50.4198 5.48347C49.2366 1.647 46.2697 0.0878906 42.4021 0.0878906ZM46.2343 15.1359C46.1637 15.714 46.1284 16.117 45.9518 16.5899C45.2983 18.7622 43.7972 19.2001 41.6427 19.2352H38.2166V5.7112C38.2166 5.20318 38.8347 4.80026 39.3292 4.80026H41.2895C42.4551 4.80026 43.7443 4.99296 44.4507 5.37836C45.1571 5.76376 45.6515 6.44696 45.9518 7.4455C46.1284 7.936 46.1814 8.3214 46.2343 8.93453C46.3226 9.9681 46.305 10.7915 46.3226 12.0352C46.305 13.279 46.3226 14.1024 46.2343 15.1359Z"
        fill="#054A86"
       />
       <path
        d="M23.8235 11.8072C23.8235 5.29047 18.4901 0 11.9206 0H3.72628C1.67771 0 0 1.6467 0 3.69632V8.30358C0 10.3357 1.66005 11.9999 3.72628 11.9999H16.212C9.46582 11.9999 4.00885 17.3079 4.09715 23.9998H11.7087C18.4548 23.9998 23.9118 18.4991 23.8235 11.8072Z"
        fill="#054A86"
       />
      </svg>
     </Link>
     <h1 className="text-[60px] font-bold tracking-tight text-[#2B2B43]">
      Sign in
     </h1>
     <p className="mt-3 text-base font-normal text-[#545563]">
      Sign in with your data that you entered during your registration.
     </p>

     {/* Email */}
     <div className="space-y-1 mt-7">
      <label htmlFor="email" className="text-xs font-semibold text-[#545563]">
       Email
      </label>
      <input
       id="email"
       type="email"
       placeholder="name@example.com"
       className="w-full rounded-lg border h-11 border-[#C7C8D2] px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none"
      />
     </div>
     {/* Password */}
     <div className="mt-6 space-y-1">
      <label
       htmlFor="password"
       className="text-xs font-semibold text-[#545563]">
       Password
      </label>
      <div className="relative">
       <input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="min. 8 characters"
        className="w-full rounded-lg border h-11 border-[#C7C8D2] px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none"
       />
       <button
        type="button"
        aria-label={showPassword ? "Hide password" : "Show password"}
        onClick={() => setShowPassword((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
        {showPassword ? (
         <EyeOff className="w-5 h-5" />
        ) : (
         <Eye className="w-5 h-5" />
        )}
       </button>
      </div>
     </div>
     {/* Keep logged in */}
     <label className="mt-6 flex items-center gap-2 ">
      <input
       type="checkbox"
       checked={keepLoggedIn}
       onChange={(e) => setKeepLoggedIn(e.target.checked)}
       className="h-5 w-5 accent-[#0A3B79] cursor-pointer"
      />
      <span className="text-[#2B2B43] text-base font-normal">
       Keep me logged in
      </span>
     </label>

     {/* Login */}
     <Button
      variant="default"
      className="mt-5 w-full h-11 font-bold"
      style={{ boxShadow: "0px 8px 20px 0px #4E60FF29" }}>
      Login
     </Button>

     {/* Forgot */}
     <div className="mt-6 text-center">
      <button
       className="text-sm font-bold text-[#054A86] hover:underline"
       onClick={() => setForgetForm(true)}>
       Forgot password
      </button>
     </div>
    </div>
    <div className="mt-[70px] font-bold text-sm text-[#545563] text-center">
     Don’t have an account?{" "}
     <button
      className="underline font-bold text-[#056AC1]"
      onClick={() => navigate("/signup")}>
      Create an account
     </button>
    </div>
    {/* Back link (optional) */}
    {onBack && (
     <div className="mt-6 text-center">
      <button
       onClick={onBack}
       className="text-sm text-slate-600 hover:text-slate-800 underline">
       Back
      </button>
     </div>
    )}
   </div>
  );
 };
 return !showForgetForm ? (
  <SignInFormComponent />
 ) : (
  <ForgetPassword onBack={() => setForgetForm(false)} />
 );
};

export default SignInForm;
