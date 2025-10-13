import LeftBar from "@/components/sighnup/LeftBar";
import RightBar from "@/components/sighnup/RightBar";
import React from "react";

const Signup = () => {
 return (
  <section className="w-full mx-auto h-screen overflow-hidden">
   <div className="mx-w-[1110px] w-full mx-auto flex h-full">
    <LeftBar />
    <RightBar />
   </div>
  </section>
 );
};

export default Signup;