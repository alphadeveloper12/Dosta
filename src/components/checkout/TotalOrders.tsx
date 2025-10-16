// src/components/cart/OrderList.tsx
import React from "react";

import { CartItemType } from "@/pages/CartPage";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Button } from "@/pages/catering/components/ui/button";

interface OrderListProps {
 items: any;
}

const TotalOrders: React.FC<OrderListProps> = ({ items }) => {
 return (
  <div className="bg-white rounded-[16px]  p-6 border border-[#EDEEF2]">
   <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-semibold text-gray-800">
     Order Details{" "}
     <span className="text-gray-500 font-normal">({items.length} meals)</span>
    </h2>
   </div>

   <div className="space-y-4">
    {items.map((item, index) => (
     <div className="flex md:flex-row flex-col md:items-center gap-4 py-4">
      <img
       src={item.imageUrl}
       alt={item.name}
       className="w-20 h-20 rounded-md object-cover"
      />

      <div className="flex-grow">
       <h3 className="font-semibold text-gray-800">{item.name}</h3>
       <p className="text-sm text-gray-500">{item.notes}</p>
       <p className="text-sm text-[#2B2B43] mt-1"><span className="text-[#545563]">Pickup at:</span>{item.pickupLocation}</p>
      </div>

      <div className="flex items-center gap-4">
       {/* Quantity Stepper */}
        <span className="text-[#545563]">x 1</span>
       {/* Price */}
       <div className="w-24 text-right">
        <p className="text-lg font-semibold text-gray-900">
         AED{item.price.toFixed(2)}
        </p>
       </div>

       {/* Delete Button */}
      </div>
     </div>
    ))}
   </div>

   <Link
    className="mt-6 flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition-colors"
    to={"/vending-home/order-now"}>
    <PlusIcon className="w-5 h-5" />
    <span>Add More Meals</span>
   </Link>
  </div>
 );
};

export default TotalOrders;
