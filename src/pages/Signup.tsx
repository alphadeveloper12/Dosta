import LeftBar from "@/components/sighnup/LeftBar";
import RightBar from "@/components/sighnup/RightBar";
import React from "react";

const Signup = () => {
 return (
  <section className="w-full h-screen overflow-hidden">
   <div className="max-w-[90rem] mx-auto flex h-full">
    <LeftBar />
    <RightBar />
   </div>
  </section>
 );
};

export default Signup;