import React from "react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Divide, X } from "lucide-react";
import { Link } from "react-router-dom";

interface FoodItem {
 imgSrc: string;
 heading: string;
 imgAlt: string;
 description: string;
 price: string;
}
interface CrabMenuProps {
 handleConfirmStep: () => void;
}

const GrabMenu: React.FC<CrabMenuProps> = ({ handleConfirmStep }) => {
 const [openDialouge, setOpenDialouge] = useState(false);
 const [scrolled, setScrolled] = useState(false);
 const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
 const [isSheetOpen, setIsSheetOpen] = useState(false);
 const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);

 const handleCardClick = (item: FoodItem) => {
  setSelectedItem(item);
  setIsSheetOpen(true);
 };
 const confirmFunc = () => {
  setOpenDialouge(false);
  setSelectedItems([]);
 };

 useEffect(() => {
  let ticking = false;
  const onScroll = () => {
   if (!ticking) {
    window.requestAnimationFrame(() => {
     setScrolled(window.scrollY > 120);
     ticking = false;
    });
    ticking = true;
   }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
 }, []);

 const foodData: FoodItem[] = [
  {
   imgSrc: "/images/vending_home/soft_drink.svg",
   heading: "Soft Drink",
   imgAlt: "food",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/soft_drink.svg",
   heading: "Soft Drink",
   imgAlt: "food",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/soft_drink.svg",
   heading: "Soft Drink",
   imgAlt: "food",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/soft_drink.svg",
   heading: "Soft Drink",
   imgAlt: "food",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/soft_drink.svg",
   heading: "Soft Drink",
   imgAlt: "food",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/soft_drink.svg",
   heading: "Soft Drink",
   imgAlt: "food",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/soft_drink.svg",
   heading: "Soft Drink",
   imgAlt: "food",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/soft_drink.svg",
   heading: "Soft Drink",
   imgAlt: "food",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/soft_drink.svg",
   heading: "Soft Drink",
   imgAlt: "food",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/soft_drink.svg",
   heading: "Soft Drink",
   imgAlt: "food",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/soft_drink.svg",
   heading: "Soft Drink",
   imgAlt: "food",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/soft_drink.svg",
   heading: "Soft Drink",
   imgAlt: "food",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
  {
   imgSrc: "/images/vending_home/soft_drink.svg",
   heading: "Soft Drink",
   imgAlt: "food",
   description:
    "Ea his sensibus eleifend, mollis iudicabit omittantur id mel. Et cum ignota euismod corpora, et saepe.",
   price: "AED 47.25",
  },
 ];


 return (
  <div className="min-h-screen">
   <main className="flex-1 bg-neutral-white">
    <div className="w-full bg-transparent pt-2 pb-6">
     <div className="main-container">
      {/* title and button */}
      <div className="flex md:flex-row flex-col justify-between items-center py-4">
       <h2 className="text-[16px] text-[#2B2B43] leading-[24px] font-[700] tracking-[0.1px]">
        Choose your meal from our daily menu of 13 chef-prepared meals
       </h2>
       <div className="flex gap-4 md:flex-row flex-col">
        {selectedItems.length > 0 && (
         <Button
          className="bg-transparent hover:bg-transparent text-[#545563] border border-[#545563]"
          onClick={() => setOpenDialouge(true)}>
          Reset
         </Button>
        )}
        {selectedItems.length > 0 ? (
         <Button
          className="bg-[#054A86] hover:bg-[#054A86]"
          onClick={() => handleConfirmStep()}>
          Confirm and review
         </Button>
        ) : (
         <Button className="bg-[#F7F7F9] hover:bg-[#F7F7F9] text-[#C7C8D2]">
          Confirm and review
         </Button>
        )}
       </div>
      </div>
      <div className="flex md:flex-row justify-between flex-col py-2">
       <p className="text-[14px] font-[400] leading-[20px] tracking-[0.2px] text-[#545563]">
        {selectedItems.length === 0
         ? "No selected meals"
         : `Selected meals: ${selectedItems
            .map((item) => item.heading)
            .join(", ")}`}
       </p>
       <p className="text-[14px] font-[400] leading-[20px] tracking-[0.2px] text-[#545563]">
        Total: <span className="font-[700]">{selectedItems.length} Meals</span>
       </p>
      </div>
     </div>
    </div>

    <div className="w-full h-full pb-4">
     <div className="main-container  flex gap-[24px] flex-wrap">
      {foodData.map((data, index) => {
       return (
        <div
         key={index}
         onClick={() => handleCardClick(data)}
         className={`w-full border ${
          selectedItems.includes(data) ? "border-[#054A86]" : "border-[#EDEEF2]"
         } max-w-[306px] bg-neutral-white rounded-[16px] px-3 pt-3 pb-5 sm:px-4 sm:pt-4 sm:pb-6 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow`}>
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
         <div className="flex justify-between items-center pt-2">
          <h4 className="text-[16px]  leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
           {data.price}
          </h4>

          {selectedItems.includes(data) ? (
           <>
            <div className="flex items-center gap-2">
             <span className="h-[20px] w-[20px] bg-[#EDEEF2] flex items-center justify-center rounded-[8px] text-[#2B2B43]">
              -
             </span>
             <span>1</span>
             <span className="h-[20px] w-[20px] bg-[#EDEEF2] flex items-center justify-center rounded-[8px] text-[#2B2B43]">
              +
             </span>
            </div>
           </>
          ) : (
           <img src="/images/icons/plusicon.svg" alt="plus icon" />
          )}
         </div>
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

         <h3 className="text-[24px] leading-[32px] font-[700] tracking-[0.1px]">
          {selectedItem.price}
         </h3>

         {selectedItem && (
          <div className="pb-[24px]">
           <img src="/images/icons/offertag.svg" alt="offer" />
           <p className="py-3 px-[18px]">Buy one get one for free</p>
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
         <button
          onClick={() => {
           setSelectedItems((prev) => [...prev, selectedItem]);
           setSelectedItem(null);
          }}
          className="w-full bg-[#054A86] text-white rounded-lg py-2 font-medium ">
          + Add
         </button>
        </div>
       </motion.div>
      </motion.div>
     )}
    </AnimatePresence>

    {/* menu */}
    
    {openDialouge && (
     <motion.div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.div
       className="bg-white px-4 py-5  rounded-lg shadow-lg max-w-[394px] "
       initial={{ scale: 0.8, opacity: 0 }}
       animate={{ scale: 1, opacity: 1 }}
       exit={{ scale: 0.8, opacity: 0 }}
       transition={{ duration: 0.2 }}>
       <div className=" text-lg font-bold mb-2 gap-3 flex ">
        <img src="/images/icons/info_icon.svg" alt="info" />
        <h3>Reset Menu Selection?</h3>
       </div>
       <p className="text-[#545563] mb-8">
        Are you sure you want to reset your menu selection?
       </p>
       <div className="flex justify-end gap-4">
        <button
         onClick={() => setOpenDialouge(false)}
         className="px-4 py-2 bg-neutral-white border border-[neutral/gray dark] rounded-[8px] hover:bg-gray-300">
         Cancel
        </button>
        <button
         onClick={() => confirmFunc()}
         className="px-4 py-2 bg-[#054A86] text-white rounded-lg hover:bg-[#054A86]">
         Confirm
        </button>
       </div>
      </motion.div>
     </motion.div>
    )}
   </main>
  </div>
 );
};

export default GrabMenu;
