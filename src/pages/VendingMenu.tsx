import BreadCrumb from "@/components/home/BreadCrumb";
import { Button } from "@/components/ui/button";
import VendingHeader from "@/components/vending_home/VendingHeader";
import React from "react";

const VendingMenu = () => {
 return (
  <div className="min-h-screen flex flex-col">
   <VendingHeader />
   <main className="flex-1 bg-background">
    {/* bread crumb and title  */}
    <div className="w-full bg-neutral-white pt-2 pb-6">
     <div className="main-container ">
      <BreadCrumb />
      <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
       Vending Menu
      </h2>
     </div>
    </div>
    {/* absoluted menu weekly tabs section */}
    <div className="w-full bg-neutral-white pt-2 pb-6">
     <div className="main-container ">
      {/* title and button */}
      <div className="flex justify-between items-center py-4">
       <h2 className="text-[24px] text-[#2B2B43] leading-[32px] font-[700] tracking-[0.1px]">
        Browse our daily menu of 13 chef-prepared meals
       </h2>
       <Button className="bg-[#054A86]">Start Your Order</Button>
      </div>
      {/* weekly tabs  */}
      <div className=""></div>
     </div>
    </div>
   </main>
  </div>
 );
};

export default VendingMenu;
