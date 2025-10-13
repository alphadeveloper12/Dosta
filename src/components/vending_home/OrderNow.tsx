import React from "react";
import VendingHeader from "./VendingHeader";
import Footer from "../layout/Footer";
import BreadCrumb from "../home/BreadCrumb";

const OrderNow = () => {
 return (
  <div className="min-h-screen">
   <VendingHeader />
   <main className="flex-1 bg-[#F7F7F9] ">
    {/* bread crumb and title */}
    <div className={`w-full bg-neutral-white pt-2 pb-6 `}>
     <div className="main-container">
      <BreadCrumb />
      <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
       Vending Pickup
      </h2>
     </div>
    </div>
    <div className="w-full py-6">
     <div className="main-container ">
      {/* step no 1  */}
      <div className="w-full border border-[#EDEEF2] py-[20px] px-[24px] bg-neutral-white rounded-[16px]  ">
       <div>
        <div className="flex gap-4">
         <div className="h-[32px] w-[32px] bg-[#054A86] text-neutral-white rounded-full inline-flex items-center justify-center">
          1
         </div>
         <div>
          <h2 className="text-[24px] leading-[32px] font-[700] tracking-[0.1px] text-[#545563]">
           Select Pickup Location
          </h2>
          <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#056AC1]">
           Barsha 1, Near Mall of the Emirates, St. 12.
          </h4>
         </div>
        </div>
       </div>
       <div></div>
      </div>
     </div>
    </div>
   </main>
   <Footer />
  </div>
 );
};

export default OrderNow;
