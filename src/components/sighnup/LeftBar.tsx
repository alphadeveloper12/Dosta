import React from "react";

const LeftBar = () => {
 return (
  <div className="left w-[42.36%] h-screen bg-[#054A86] pl-[165px] py-[80px] pr-[56px] flex flex-col justify-between">
   <img
    src="/images/nav/logo.svg"
    alt="dosta logo"
    className="h-[24px] w-[135px]"
   />
   <div>
    <h1 className="text-[28px] leading-[36px] tracking-[0.1px] font-[700] text-neutral-white pb-5">
     A few steps to create your account
    </h1>
    <p className="text-[14px] text-neutral-white leading-[20px] tracking-[0.2px] font-[400]">
     Lorem ipsum dolor sit amet, magna scaevola his ei. Cum te paulo probatus
     molestiae.
    </p>
   </div>
  </div>
 );
};

export default LeftBar;
