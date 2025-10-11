import LeftBar from "@/components/sighnup/LeftBar";
import RightBar from "@/components/sighnup/RightBar";
import React from "react";

const Signup = () => {
 return (
  <section className="w-full h-screen">
   <div className="max-w-[1440px] mx-auto flex ">
    <LeftBar />
    <RightBar/>
   </div>
  </section>
 );
};

export default Signup;
