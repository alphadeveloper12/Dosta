import React from "react";
import ImageWithShimmer from "../ui/ImageWithShimmer";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export interface BeitNahlaImage {
 id: number;
 image_url: string;
 alt_text: string;
 order: number;
}

export interface MealBoxType {
 id: number;
 name: string;
 description: string | null;
 image_url: string | null;
 images: BeitNahlaImage[];
 display_order: number;
}

export interface SelectedMealBox {
 box: MealBoxType;
 selections: Record<number, number[]>; // categoryId -> [optionItemIds]
 unitPrice: number; // 40 or 35 based on mode
}

interface BeitNahlaCardProps {
 data: MealBoxType;
 priceLabel: string; // e.g. "AED 40.00"
 priceSuffix?: string; // e.g. "per box" or "per box · 6 days"
 isSelected: boolean;
 onSeeOptions: (box: MealBoxType) => void;
}

const BeitNahlaCard: React.FC<BeitNahlaCardProps> = ({
 data,
 priceLabel,
 priceSuffix = "per box",
 isSelected,
 onSeeOptions,
}) => {
 const allImages =
  data.images && data.images.length > 0
   ? data.images.map((img) => img.image_url)
   : [data.image_url || "https://placehold.co/400x300?text=Beit+Nahla"];

 return (
  <div
   className={`w-full border ${
    isSelected ? "border-[#054A86]" : "border-[#EDEEF2]"
   } max-w-[306px] bg-white rounded-[12px] md:rounded-[16px] px-2 pt-2 pb-4 sm:px-4 sm:pt-4 sm:pb-6 overflow-hidden hover:shadow-lg transition-shadow flex flex-col`}>
   <div className="relative">
    <ImageWithShimmer
     src={allImages[0]}
     alt={data.name}
     wrapperClassName="w-full h-[160px] md:h-[220px] rounded-[12px] sm:rounded-[16px] object-cover"
     className="w-full h-full object-cover"
    />
    {isSelected && (
     <div className="absolute top-2 right-2 bg-[#054A86] text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-md">
      Selected
     </div>
    )}
   </div>

   <div className="flex-1 flex flex-col pt-3">
    <h3
     title={data.name}
     className="text-[13px] leading-[18px] md:text-[18px] md:leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43] break-words">
     {data.name}
    </h3>

    <div className="flex justify-between items-center pt-4 mt-auto">
     <div className="flex flex-col">
      <h4 className="md:text-[16px] text-[13px] leading-[16px] md:leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
       {priceLabel}
      </h4>
      <span className="text-[9px] md:text-[10px] text-[#83859C] font-medium leading-none">
       {priceSuffix}
      </span>
     </div>

     <button
      onClick={(e) => {
       e.stopPropagation();
       onSeeOptions(data);
      }}
      className="flex items-center gap-1 bg-[#054A86] text-white text-[11px] md:text-[12px] font-bold px-3 py-2 rounded-[8px] hover:bg-[#054A86]/90 transition-colors">
      See options
      <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4" />
     </button>
    </div>
   </div>
  </div>
 );
};

export default BeitNahlaCard;
