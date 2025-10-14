import BreadCrumb from "@/components/home/BreadCrumb";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import VendingHeader from "@/components/vending_home/VendingHeader";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface FoodItem {
 imgSrc: string;
 heading: string;
 imgAlt: string;
 title: string;
 description: string;
 price: string;
}

const VendingMenu = () => {
 const [scrolled, setScrolled] = useState(false);
 const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
 const [isSheetOpen, setIsSheetOpen] = useState(false);
 const [tab, setTab] = useState<number>();

 const handleCardClick = (item: FoodItem) => {
  setSelectedItem(item);
  setIsSheetOpen(true);
 };

useEffect(() => {
  const onScroll = () => {
    // Set the scroll state only when scroll position is greater than 220
    if (window.scrollY >= 220) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  // Attach the scroll event listener
  window.addEventListener("scroll", onScroll, { passive: true });

  // Clean up the event listener on component unmount
  return () => window.removeEventListener("scroll", onScroll);
}, []);


 const foodData: FoodItem[] = [
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food",
   title: "",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food",
   title: "",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food",
   title: "",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food",
   title: "",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food",
   title: "",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food",
   title: "",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food",
   title: "",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food",
   title: "",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food",
   title: "",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food",
   title: "",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food",
   title: "",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food",
   title: "",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/food.svg",
   heading: "Angus Burger",
   imgAlt: "food",
   title: "",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
 ];

 const days = [
  { day: "Monday" },
  { day: "Tuesday" },
  { day: "Wednesday" },
  { day: "Thursday" },
  { day: "Friday" },
 ];

 return (
  <div className="min-h-screen">
   <VendingHeader />
   <main className="flex-1 bg-[#F7F7F9]">
    {/* bread crumb and title (this will hide on scroll ) */}
    <div
     className={`w-full bg-neutral-white pt-2 pb-6 ${
      scrolled ? "hidden" : ""
     }`}>
     <div className="main-container">
      <BreadCrumb />
      <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
       Vending Menu
      </h2>
     </div>
    </div>

    {/* this will show when user scrolls and this will become sticky */}
    <div
     className={`w-full bg-neutral-white pt-2 pb-6 shadow-lg ${
      scrolled ? "sticky top-[64px] block" : "hidden"
     }`}>
     <div className="main-container">
      {/* title and button */}
      <div className="md:flex hidden justify-between items-center py-4 md:flex-row flex-col gap-2">
       <h2 className="md:text-[24px] text-[18px] leading-[24px] text-[#2B2B43] md:leading-[32px] font-[700] tracking-[0.1px]">
        Browse our daily menu of 13 chef-prepared meals
       </h2>
       <Button className="bg-[#054A86] max-md:w-full ">Start Your Order</Button>
      </div>
      {/* weekly tabs  */}
      <div className="flex gap-3 flex-wrap pt-[8px]">
       {/* tabs */}
       {days.map((week, index) => {
        return (
         <div
          key={index}
          onClick={() => setTab(index)}
          className={`md:h-[56px] h-[26px] ${
           tab === index ? "bg-[#EAF5FF]" : "hover:bg-[#EAF5FF]"
          } bg-neutral-white cursor-pointer text-center inline-flex items-center w-full justify-center md:max-w-[212px] max-w-[80px] rounded-[16px] border-2 border-[#054A86]`}>
          <span className="md:text-[16px] text-[12px] leading-[18px]  md:leading-[24px] font-[400]">{week?.day}</span>
         </div>
        );
       })}
      </div>
     </div>
    </div>



    {/* fixed menu weekly tabs section this will also hide when user scrolls */}
    <div className={`w-full ${scrolled ? "hidden" : "block"} bg-transparent pt-2 pb-6`}>
     <div className="main-container">
       {/* title and button */}
      <div className="flex justify-between items-center py-4 md:flex-row flex-col gap-2">
       <h2 className="md:text-[24px] text-[18px] leading-[24px] text-[#2B2B43] md:leading-[32px] font-[700] tracking-[0.1px]">
        Browse our daily menu of 13 chef-prepared meals
       </h2>
       <Button className="bg-[#054A86] max-md:w-full ">Start Your Order</Button>
      </div>
      {/* weekly tabs  */}
      <div className="flex gap-3 flex-wrap pt-[8px]">
       {/* tabs */}
       {days.map((week, index) => {
        return (
         <div
          key={index}
          onClick={() => setTab(index)}
          className={`md:h-[56px] h-[26px] ${
           tab === index ? "bg-[#EAF5FF]" : "hover:bg-[#EAF5FF]"
          } bg-neutral-white cursor-pointer text-center inline-flex items-center w-full justify-center md:max-w-[212px] max-w-[80px] rounded-[16px] border-2 border-[#054A86]`}>
          <span className="md:text-[16px] text-[12px] leading-[18px]  md:leading-[24px] font-[400]">{week?.day}</span>
         </div>
        );
       })}
      </div>
     </div>
    </div>

    <div className="w-full h-full pb-4">
     <div className="main-container flex gap-[24px] flex-wrap">
      {foodData.map((data, index) => {
       return (
        <div
         key={index}
         onClick={() => handleCardClick(data)}
         className="w-full border border-[#EDEEF2] max-w-[354px] bg-neutral-white rounded-[16px] px-3 pt-3 pb-5 sm:px-4 sm:pt-4 sm:pb-6 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
         <img
          src={data.imgSrc}
          alt={data.imgAlt}
          className="block w-full h-auto rounded-[12px] sm:rounded-[16px] object-cover"
         />
         <h3 className="text-[24px] pt-3 pb-1 leading-[32px] font-[700] tracking-[0.1px] text-[#2B2B43]">
          {data.heading}
         </h3>
         <p className="text-[14px] line-clamp-2 leading-[20px] font-[400] tracking-[0.2px] text-[#83859C]">
          {data.description}
         </p>
         <h4 className="text-[16px] pt-2 leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
          {data.price}
         </h4>
        </div>
       );
      })}
     </div>
    </div>

    {/* Sidebar Sheet */}
    <AnimatePresence>
     {selectedItem && (
      <motion.div
       className="fixed inset-0 z-50 flex justify-end bg-black/75 "
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}>
       {/* Sidebar Panel */}
       <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        className="bg-white w-full px-8 py-4 max-w-[522px] h-full shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-[16px] ">
         <h2 className="text-[28px] leading-[36px] font-[700] ">
          {selectedItem.heading}
         </h2>
         <button
          onClick={() => setSelectedItem(null)}
          className="p-2 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
         </button>
        </div>

        {/* Image */}
        <img
         src={selectedItem.imgSrc}
         alt={selectedItem.imgAlt}
         className="w-full object-cover h-60 md:h-[343px] rounded-[16px]"
        />

        {/* Content */}
        <div className="flex-1 p-5 space-y-4">
         <p className="text-gray-600 text-sm">{selectedItem.description}</p>

         <div className="text-lg font-semibold">{selectedItem.price}</div>

         {selectedItem && (
          <div className="pb-[24px]">
           <p>Buy one get one for free</p>
          </div>
         )}
         <div>
          <Link
           className="text-[#056AC1] text-[16px] leading-[24px] font-[400] tracking-[0.1px] underline"
           to={"/"}>
           Terms & conditions Apply
          </Link>
         </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4  flex flex-col sm:flex-row gap-3">
         <button
          onClick={() => setSelectedItem(null)}
          className="w-full border border-[#054A86] rounded-lg py-2 font-medium text-[#054A86]">
          Close
         </button>
         <button className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium hover:bg-blue-700">
          Start Your Order
         </button>
        </div>
       </motion.div>
      </motion.div>
     )}
    </AnimatePresence>
   </main>
   <Footer />
  </div>
 );
};

export default VendingMenu;
