import { Check } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
// import RenderStep from "./RenderStep";

const RightBar = () => {
 const steps = [1, 2, 3];
 const [currentStep, setCurrentStep] = useState<number>(1);
 const RenderStep = () => {
  switch (currentStep) {
   case 1:
    return (
     <>
      <div>
       <h1 className="text-[60px] leading-[82px] tracking-[0.1px] font-[700] pb-4">
        Personal details
       </h1>
       <p className="text-[16px] text-neutral-gray-dark leading-[24px] tracking-[0.1px] font-[400] pb-7">
        Enter your data that you will use for entering.
       </p>
       {/* enter email */}
       <div className="flex flex-col pb-7">
        <label
         htmlFor=""
         className="text-[12px] text-neutral-gray-dark font-[600] leading-[16px]">
         Email
        </label>
        <input
         type="email"
         placeholder="name@example.com"
         className=" w-[350px] py-[10px] px-[12px] outline-none border border-[#C7C8D2] rounded-[8px]"
        />
       </div>
       {/* enter password */}
       <div className="flex flex-col pb-7">
        <label
         htmlFor=""
         className="text-[12px] text-neutral-gray-dark font-[600] leading-[16px]">
         Password
        </label>
        <input
         type="password"
         placeholder="min. 8 characters"
         className=" w-[350px] py-[10px] px-[12px] outline-none border border-[#C7C8D2] rounded-[8px]"
        />
       </div>
       {/* enter confirm password */}
       <div className="flex flex-col pb-7">
        <label
         htmlFor=""
         className="text-[12px] text-neutral-gray-dark font-[600] leading-[16px]">
         Confirm Password
        </label>
        <input
         type="password"
         placeholder="min. 8 characters"
         className=" w-[350px] py-[10px] px-[12px] outline-none border border-[#C7C8D2] rounded-[8px]"
        />
       </div>
      </div>
     </>
    );
   case 2:
    return (
     <>
      <div>
       <h1 className="text-[60px] leading-[82px] tracking-[0.1px] font-[700] pb-4">
        Additional info
       </h1>
       <p className="text-[16px] text-neutral-gray-dark leading-[24px] tracking-[0.1px] font-[400] pb-7">
        Enter your additional information
       </p>
       {/* enter phone number */}
       <div className="flex flex-col pb-7">
        <label
         htmlFor=""
         className="text-[12px] text-neutral-gray-dark font-[600] leading-[16px]">
         Phone number
        </label>
        <input
         type="number"
         placeholder="(217) 555-0113"
         className=" w-[350px] py-[10px] px-[12px] outline-none border border-[#C7C8D2] rounded-[8px]"
        />
       </div>

       {/* 2-factor authentication */}
       <div className="flex gap-3 pb-7 items-center">
        <input type="checkbox" className="h-[20px] w-[20px]" />
        <span className="text-[16px] leading-6 font-[400] tracking-[0.1px]">
         Turn on 2 factor authentication
        </span>
       </div>
      </div>
     </>
    );
   case 3:
    return (
     <>
      <div>
       <h1 className="text-[60px] leading-[82px] tracking-[0.1px] font-[700] pb-4">
        Confirmation
       </h1>
       <p className="text-[16px] text-neutral-gray-dark leading-[24px] tracking-[0.1px] font-[400] pb-7">
        Enter your security code that we sent to your phone
       </p>
       {/* enter verification code */}
       <div className="flex flex-col pb-7">
        <label
         htmlFor=""
         className="text-[12px] text-neutral-gray-dark font-[600] leading-[16px]">
         Confirmation code
        </label>
        <input
         type="number"
         placeholder="XXX - XXX - XXX"
         className=" w-[350px] py-[10px] px-[12px] outline-none border border-[#C7C8D2] rounded-[8px]"
        />
       </div>

       {/* remember device */}
       <div className="flex gap-3 pb-7 items-center">
        <input type="checkbox" className="h-[20px] w-[20px]" />
        <span className="text-[16px] leading-6 font-[400] tracking-[0.1px]">
         TRemember this device
        </span>
       </div>
      </div>
     </>
    );
  }
 };
 const handleNext = () => {
  if (currentStep < 3) {
   setCurrentStep(currentStep + 1);
  }
  return;
 };
 const handlePrevious = () => {
  if (currentStep > 1) {
   setCurrentStep(currentStep - 1);
  }
  return;
 };

 return (
  <section className="bg-neutral-white pl-[125px] pt-[64px] pb-[38px] w-[57.64%] h-screen">
   <div className="flex flex-col justify-between h-full">
    {/* top steps bar */}
    <div className="flex items-center justify-start   max-w-[33.75rem] gap-3 ">
     {steps.map((step, index) => {
      const isCompleted = step < currentStep;
      const isActive = step === currentStep;

      return (
       <div key={step} className="flex items-center justify-center gap-3">
        {/* Step Circle */}
        <div
         className={`md:w-3 md:h-3 h-3 w-3 flex items-center justify-center  rounded-full font-[500] font-sfpro
                    ${isCompleted ? "bg-green-500 text-white" : ""}
                    ${isActive ? "bg-[#054A86] text-white" : ""}
                    ${
                     !isCompleted && !isActive
                      ? "bg-gray-300 text-gray-600"
                      : ""
                    }
                  `}>
         <span className="md:text-[0.8rem] text-[0.7rem]">
          {isCompleted ? <Check size={14} /> : ""}
         </span>
        </div>

        {/* Line between steps */}
        {index < steps.length - 1 && (
         <div
          className={`h-[1px] w-[10rem] ${
           isCompleted ? "bg-green-500" : "bg-gray-300"
          }  `}
         />
        )}
       </div>
      );
     })}
    </div>
    {/* content */}
    <div>
     {RenderStep()}
     <div className="flex flex-col gap-3">
      <button
       className="w-[350px] text-[14px] leading-[20px] font-[700] bg-primary text-center py-3 px-4 rounded-[8px] text-neutral-white"
       onClick={() => handleNext()}>
       continue
      </button>
      <button
       className="w-[350px] text-[14px] leading-[20px] font-[700] bg-neutral-white  text-center py-3 px-4 rounded-[8px] text-neutral-gray-dark"
       onClick={() => handlePrevious()}>
       Back
      </button>
     </div>
    </div>
    {/* text */}
    <div className="text-center w-[350px]">
     <p>
      Already have an account?{" "}
      <Link to={"/signin"} className="text-[#056AC1] underline">
       Sign in
      </Link>
     </p>
    </div>
   </div>
  </section>
 );
};

export default RightBar;
