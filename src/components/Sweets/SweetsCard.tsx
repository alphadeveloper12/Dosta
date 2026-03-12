import React, { useRef, useState } from "react";
import ImageWithShimmer from "../ui/ImageWithShimmer";
import {
 MinusIcon,
 PlusIcon,
 ChevronLeftIcon,
 ChevronRightIcon,
} from "@heroicons/react/24/outline";

export interface SweetsItemImage {
 id: number;
 image_url: string;
 alt_text: string;
 order: number;
}

export interface SweetsItemVariation {
 id: number;
 weight: string;
 price: string;
}

export interface SweetsItemType {
 imgSrc: string | null;
 images: SweetsItemImage[];
 heading: string;
 imgAlt: string;
 description: string;
 price: string;
 id: number;
 variations?: SweetsItemVariation[];
}

export interface SelectedSweetsItem extends SweetsItemType {
 quantity: number;
 selectedVariation?: SweetsItemVariation;
}

interface SweetsCardProps {
 data: SweetsItemType;
 cartItems: SelectedSweetsItem[];
 handleCardClick: (
  item: SweetsItemType,
  variation?: SweetsItemVariation,
 ) => void;
 handleQuantityChange: (
  e: React.MouseEvent,
  foodItem: SweetsItemType,
  change: number,
  variation?: SweetsItemVariation,
 ) => void;
}

const SweetsCard: React.FC<SweetsCardProps> = ({
 data,
 cartItems,
 handleCardClick,
 handleQuantityChange,
}) => {
 const [selectedVariation, setSelectedVariation] = useState<
  SweetsItemVariation | undefined
 >(
  data.variations && data.variations.length > 0
   ? data.variations[0]
   : undefined,
 );

 const [currentImgIndex, setCurrentImgIndex] = useState(0);
 const touchStartX = useRef<number>(0);
 const swiped = useRef<boolean>(false);

 // Build image list: use multi-images if available, else fall back to single image
 const allImages =
  data.images && data.images.length > 0
   ? data.images.map((img) => img.image_url)
   : [data.imgSrc || "https://placehold.co/400x300?text=Sweets"];

 const itemInCart = cartItems.find(
  (i) =>
   i.id === data.id && i.selectedVariation?.id === (selectedVariation?.id || 0),
 );

 const currentPrice = selectedVariation
  ? `AED ${parseFloat(selectedVariation.price).toFixed(2)}`
  : data.price;

 return (
  <div
   onClick={() => {
    if (swiped.current) {
     swiped.current = false;
     return;
    }
    handleCardClick(data, selectedVariation);
   }}
   className={`w-full border ${
    itemInCart ? "border-[#054A86]" : "border-[#EDEEF2]"
   } max-w-[306px] bg-neutral-white rounded-[12px] md:rounded-[16px] px-2 pt-2 pb-4 sm:px-4 sm:pt-4 sm:pb-6 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-white flex flex-col`}>
   {/* Image Carousel */}
   <div
    className="relative group"
    style={{ touchAction: "pan-y" }}
    onTouchStart={(e) => {
     touchStartX.current = e.touches[0].clientX;
     swiped.current = false;
    }}
    onTouchEnd={(e) => {
     if (allImages.length <= 1) return;
     const diff = touchStartX.current - e.changedTouches[0].clientX;
     if (Math.abs(diff) > 30) {
      swiped.current = true;
      if (diff > 0) {
       setCurrentImgIndex((prev) =>
        prev === allImages.length - 1 ? 0 : prev + 1,
       );
      } else {
       setCurrentImgIndex((prev) =>
        prev === 0 ? allImages.length - 1 : prev - 1,
       );
      }
     }
    }}>
    <ImageWithShimmer
     src={allImages[currentImgIndex]}
     alt={data.imgAlt}
     wrapperClassName="w-full h-[120px] md:h-[180px] rounded-[12px] sm:rounded-[16px] object-cover"
     className="w-full h-full object-cover"
    />
    {allImages.length > 1 && (
     <>
      <button
       onClick={(e) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) =>
         prev === 0 ? allImages.length - 1 : prev - 1,
        );
       }}
       className="absolute left-1 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-1 shadow-md z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
       <ChevronLeftIcon className="w-4 h-4 text-[#2B2B43]" />
      </button>
      <button
       onClick={(e) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) =>
         prev === allImages.length - 1 ? 0 : prev + 1,
        );
       }}
       className="absolute right-1 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-1 shadow-md z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
       <ChevronRightIcon className="w-4 h-4 text-[#2B2B43]" />
      </button>
      {/* Dot indicators */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
       {allImages.map((_, idx) => (
        <span
         key={idx}
         className={`w-1.5 h-1.5 rounded-full transition-all ${
          idx === currentImgIndex ? "bg-white scale-125" : "bg-white/50"
         }`}
        />
       ))}
      </div>
     </>
    )}
    {itemInCart && (
     <div className="absolute top-2 right-2 bg-[#054A86] text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-md">
      {itemInCart.selectedVariation?.weight || "Added"}
     </div>
    )}
   </div>

   <div className="flex-1 flex flex-col pt-3">
    <h3 className="text-[14px] leading-[20px] md:text-[24px] pb-1 md:leading-[32px] font-[700] tracking-[0.1px] text-[#2B2B43] line-clamp-1">
     {data.heading}
    </h3>
    <p className="flex-1 text-[11px] md:text-[14px] line-clamp-2 leading-[16px] md:leading-[20px] font-[400] tracking-[0.2px] text-[#83859C]">
     {data.description || "A delicious sweet treat."}
    </p>

    {/* Weight Selector */}
    {data.variations && data.variations.length > 1 && (
     <div
      className="mt-3 flex flex-wrap gap-1.5"
      onClick={(e) => e.stopPropagation()}>
      {data.variations.map((v) => (
       <button
        key={v.id}
        onClick={() => setSelectedVariation(v)}
        className={`px-2 py-1 text-[10px] md:text-xs font-bold rounded-md border transition-all ${
         selectedVariation?.id === v.id
          ? "bg-[#054A86] text-white border-[#054A86]"
          : "bg-white text-[#545563] border-[#EDEEF2] hover:border-[#054A86]/50"
        }`}>
        {v.weight}
       </button>
      ))}
     </div>
    )}

    <div className="flex justify-between items-center pt-4 mt-auto">
     <div className="flex flex-col">
      <h4 className="md:text-[16px] text-[13px] leading-[16px] md:leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
       {currentPrice}
      </h4>
      {selectedVariation && data.variations && data.variations.length > 1 && (
       <span className="text-[9px] md:text-[10px] text-[#83859C] font-medium leading-none">
        Per {selectedVariation.weight}
       </span>
      )}
     </div>

     {itemInCart ? (
      <div
       className="flex items-center bg-[#EDEEF2] rounded-[6px] md:rounded-[8px] p-0.5"
       onClick={(e) => e.stopPropagation()}>
       <button
        onClick={(e) =>
         handleQuantityChange(e, data, -1, itemInCart.selectedVariation)
        }
        className="p-0.5 md:p-1 text-black">
        <MinusIcon className="w-4 h-4" />
       </button>
       <span className="px-1.5 md:px-3 text-[12px] md:text-lg font-[700] md:font-medium">
        {itemInCart.quantity}
       </span>
       <button
        onClick={(e) =>
         handleQuantityChange(e, data, 1, itemInCart.selectedVariation)
        }
        className="p-0.5 md:p-1 text-black">
        <PlusIcon className="w-4 h-4" />
       </button>
      </div>
     ) : (
      <button
       onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleQuantityChange(e, data, 1, selectedVariation);
       }}>
       <img
        src="/images/icons/plusicon.svg"
        alt="Add"
        className="w-6 h-6 hover:scale-110 transition-transform"
       />
      </button>
     )}
    </div>
   </div>
  </div>
 );
};

export default SweetsCard;
