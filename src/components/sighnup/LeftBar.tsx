import React from "react";
import { Link } from "react-router-dom";

const LeftBar = () => {
 return (
  <div className="left w-[42.36%] h-screen bg-[#054A86] pl-[5rem] lg:pl-[10.3125rem] py-[5rem] pr-[3.5rem] flex-col justify-between hidden lg:flex">
   <Link to={"/"}>
    <img
     src="/images/nav/logo.svg"
     alt="dosta logo"
     className="h-[1.5rem] w-[8.4375rem]"
    />
   </Link>
   <div>
    <h1 className="text-[1.75rem] leading-[2.25rem] tracking-[0.00625rem] font-[700] text-neutral-white pb-[1.25rem]">
     A few steps to create your account
    </h1>
    <p className="text-[0.875rem] text-neutral-white leading-[1.25rem] tracking-[0.0125rem] font-[400]">
     Lorem ipsum dolor sit amet, magna scaevola his ei. Cum te paulo probatus
     molestiae.
    </p>
   </div>
  </div>
 );
};

export default LeftBar;
