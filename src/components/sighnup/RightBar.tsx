// ========== RightBar.tsx ==========
import { Check } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const RightBar = () => {
 const steps = [1, 2, 3];
 const [currentStep, setCurrentStep] = useState<number>(1);

 const RenderStep = () => {
  switch (currentStep) {
   case 1:
    return (
     <>
      <div>
       <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.75rem] leading-[2.5rem] sm:leading-[3rem] md:leading-[4rem] lg:leading-[5.125rem] tracking-[0.00625rem] font-[700] pb-[1rem] lg:pb-[0.5rem]">
        Personal details
       </h1>
       <p className="text-[0.875rem] sm:text-[1rem] text-neutral-gray-dark leading-[1.25rem] sm:leading-[1.5rem] tracking-[0.00625rem] font-[400] pb-[1.5rem] lg:pb-[1rem]">
        Enter your data that you will use for entering.
       </p>
       {/* enter email */}
       <div className="flex flex-col pb-[1.5rem] lg:pb-[1.2rem]">
        <label
         htmlFor=""
         className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
         Email
        </label>
        <input
         type="email"
         placeholder="name@example.com"
         className="w-full max-w-[21.875rem] py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
        />
       </div>
       {/* enter password */}
       <div className="flex flex-col pb-[1.5rem] lg:pb-[1.2rem]">
        <label
         htmlFor=""
         className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
         Password
        </label>
        <input
         type="password"
         placeholder="min. 8 characters"
         className="w-full max-w-[21.875rem] py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
        />
       </div>
       {/* enter confirm password */}
       <div className="flex flex-col pb-[1.5rem] lg:pb-[1.2rem]">
        <label
         htmlFor=""
         className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
         Confirm Password
        </label>
        <input
         type="password"
         placeholder="min. 8 characters"
         className="w-full max-w-[21.875rem] py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
        />
       </div>
      </div>
     </>
    );
   case 2:
    return (
     <>
      <div>
       <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.75rem] leading-[2.5rem] sm:leading-[3rem] md:leading-[4rem] lg:leading-[5.125rem] tracking-[0.00625rem] font-[700] pb-[1rem] lg:pb-[1rem]">
        Additional info
       </h1>
       <p className="text-[0.875rem] sm:text-[1rem] text-neutral-gray-dark leading-[1.25rem] sm:leading-[1.5rem] tracking-[0.00625rem] font-[400] pb-[1.5rem] lg:pb-[1.2rem]">
        Enter your additional information
       </p>
       {/* enter phone number */}
       <div className="flex flex-col pb-[1.5rem] lg:pb-[1.75rem]">
        <label
         htmlFor=""
         className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
         Phone number
        </label>
        <input
         type="number"
         placeholder="(217) 555-0113"
         className="w-full max-w-[21.875rem] py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
        />
       </div>

       {/* 2-factor authentication */}
       <div className="flex gap-[0.75rem] pb-[1.5rem] lg:pb-[1.75rem] items-center">
        <input type="checkbox" className="h-[1.25rem] w-[1.25rem]" />
        <span className="text-[0.875rem] sm:text-[1rem] leading-[1.5rem] font-[400] tracking-[0.00625rem]">
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
       <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.75rem] leading-[2.5rem] sm:leading-[3rem] md:leading-[4rem] lg:leading-[5.125rem] tracking-[0.00625rem] font-[700] pb-[1rem] lg:pb-[1.5rem]">
        Confirmation
       </h1>
       <p className="text-[0.875rem] sm:text-[1rem] text-neutral-gray-dark leading-[1.25rem] sm:leading-[1.5rem] tracking-[0.00625rem] font-[400] pb-[1.5rem] lg:pb-[1.75rem]">
        Enter your security code that we sent to your phone
       </p>
       {/* enter verification code */}
       <div className="flex flex-col pb-[1.5rem] lg:pb-[1.75rem]">
        <label
         htmlFor=""
         className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
         Confirmation code
        </label>
        <input
         type="number"
         placeholder="XXX - XXX - XXX"
         className="w-full max-w-[21.875rem] py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
        />
       </div>

       {/* remember device */}
       <div className="flex gap-[0.75rem] pb-[1.5rem] lg:pb-[1.75rem] items-center">
        <input type="checkbox" className="h-[1.25rem] w-[1.25rem]" />
        <span className="text-[0.875rem] sm:text-[1rem] leading-[1.5rem] font-[400] tracking-[0.00625rem]">
         Remember this device
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
  <section className="bg-neutral-white w-full lg:w-[57.64%] h-screen overflow-y-auto overflow-x-hidden">
   <div className="min-h-full px-[1.25rem] sm:px-[2rem] md:px-[3rem] lg:pl-[7.8125rem] pt-[1rem] sm:pt-[3rem] lg:pt-[4rem] pb-[2rem] lg:pb-[2.375rem] flex items-center justify-center lg:items-stretch lg:justify-start">
    <div className="flex flex-col justify-between w-full max-w-[25rem] lg:max-w-none lg:min-h-full py-[1rem] lg:py-0">
    

     {/* top steps bar */}
     <div className="flex items-center justify-center lg:justify-start max-w-[33.75rem] gap-[0.75rem] mb-[2rem] lg:mb-[2rem]">
      {steps.map((step, index) => {
       const isCompleted = step < currentStep;
       const isActive = step === currentStep;

       return (
        <div
         key={step}
         className="flex items-center justify-center gap-[0.75rem]">
         {/* Step Circle */}
         <div
          className={`w-[0.75rem] h-[0.75rem] flex items-center justify-center rounded-full font-[500] font-sfpro
                    ${isCompleted ? "bg-green-500 text-white" : ""}
                    ${isActive ? "bg-[#054A86] text-white" : ""}
                    ${
                     !isCompleted && !isActive
                      ? "bg-gray-300 text-gray-600"
                      : ""
                    }
                  `}>
          <span className="text-[0.7rem]">
           {isCompleted ? <Check size={14} /> : ""}
          </span>
         </div>

         {/* Line between steps */}
         {index < steps.length - 1 && (
          <div
           className={`h-[0.0625rem] w-[6rem] sm:w-[8rem] md:w-[10rem] ${
            isCompleted ? "bg-green-500" : "bg-gray-300"
           }`}
          />
         )}
        </div>
       );
      })}
     </div>

     {/* content */}
     <div className="flex-grow flex flex-col justify-center lg:justify-start">
      {RenderStep()}
      <div className="flex flex-col gap-[0.75rem]">
       <button
        className="w-full max-w-[21.875rem] text-[0.875rem] leading-[1.25rem] font-[700] bg-primary text-center py-[0.75rem] px-[1rem] rounded-[0.5rem] text-neutral-white hover:bg-primary/90 transition-colors"
        onClick={() => handleNext()}>
        continue
       </button>
       <button
        className="w-full max-w-[21.875rem] text-[0.875rem] leading-[1.25rem] font-[700] bg-neutral-white text-center py-[0.75rem] px-[1rem] rounded-[0.5rem] text-neutral-gray-dark border border-gray-300 hover:bg-gray-50 transition-colors"
        onClick={() => handlePrevious()}>
        Back
       </button>
      </div>
     </div>

     {/* text */}
     <div className="text-center w-full max-w-[21.875rem] mx-auto lg:mx-0 mt-[2rem] lg:mt-0">
      <p className="text-[0.875rem] sm:text-[1rem]">
       Already have an account?{" "}
       <Link to={"/signin"} className="text-[#056AC1] underline">
        Sign in
       </Link>
      </p>
     </div>
    </div>
   </div>
  </section>
 );
};

export default RightBar;