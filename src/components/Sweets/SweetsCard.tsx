import React, { useState } from "react";
import ImageWithShimmer from "../ui/ImageWithShimmer";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export interface SweetsItemType {
 imgSrc: string | null;
 heading: string;
 imgAlt: string;
 description: string;
 price: string;
 id: number;
}

export interface SelectedSweetsItem extends SweetsItemType {
 quantity: number;
}

interface SweetsCardProps {
 data: SweetsItemType;
 itemInCart?: SelectedSweetsItem;
 handleCardClick: (item: SweetsItemType) => void;
 handleQuantityChange: (
  e: React.MouseEvent,
  foodItem: SweetsItemType,
  change: number,
 ) => void;
}

const SweetsCard: React.FC<SweetsCardProps> = ({
 data,
 itemInCart,
 handleCardClick,
 handleQuantityChange,
}) => {
 return (
  <div
   onClick={() => handleCardClick(data)}
   className={`w-full border ${
    itemInCart ? "border-[#054A86]" : "border-[#EDEEF2]"
   } max-w-[306px] bg-neutral-white rounded-[12px] md:rounded-[16px] px-2 pt-2 pb-4 sm:px-4 sm:pt-4 sm:pb-6 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-white flex flex-col`}>
   {/* Image Container with Shimmer */}
   <ImageWithShimmer
    src={data.imgSrc || "https://placehold.co/400x300?text=Sweets"}
    alt={data.imgAlt}
    wrapperClassName="w-full h-[120px] md:h-[180px] rounded-[12px] sm:rounded-[16px] object-cover"
    className="w-full h-full object-cover"
   />

   <div className="flex-1 flex flex-col pt-3">
    <h3 className="text-[14px] leading-[20px] md:text-[24px] pb-1 md:leading-[32px] font-[700] tracking-[0.1px] text-[#2B2B43] line-clamp-1">
     {data.heading}
    </h3>
    <p className="flex-1 text-[11px] md:text-[14px] line-clamp-2 leading-[16px] md:leading-[20px] font-[400] tracking-[0.2px] text-[#83859C]">
     {data.description || "A delicious sweet treat."}
    </p>

    <div className="flex justify-between items-center pt-4">
     <h4 className="md:text-[16px] text-[13px] leading-[16px] md:leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
      {data.price}
     </h4>

     {itemInCart ? (
      <div
       className="flex items-center bg-[#EDEEF2] rounded-[6px] md:rounded-[8px] p-0.5"
       onClick={(e) => e.stopPropagation()}>
       <button
        onClick={(e) => handleQuantityChange(e, data, -1)}
        className="p-0.5 md:p-1 text-black">
        <MinusIcon className="w-4 h-4" />
       </button>
       <span className="px-1.5 md:px-3 text-[12px] md:text-lg font-[700] md:font-medium">
        {itemInCart.quantity}
       </span>
       <button
        onClick={(e) => handleQuantityChange(e, data, 1)}
        className="p-0.5 md:p-1 text-black">
        <PlusIcon className="w-4 h-4" />
       </button>
      </div>
     ) : (
      <button
       onClick={(e) => {
        e.preventDefault();
        handleQuantityChange(e, data, 1);
       }}>
       <img src="/images/icons/plusicon.svg" alt="Add" className="w-6 h-6" />
      </button>
     )}
    </div>
   </div>
  </div>
 );
};

export default SweetsCard;
