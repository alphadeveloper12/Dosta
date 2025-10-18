// src/components/cart/CartItem.tsx
import React from "react";
import { CartItemType } from "@/pages/CartPage";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface CartItemProps {
 item: CartItemType;
 onQuantityChange: (id: number, delta: number) => void;
 onDeleteItem: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
 item,
 onQuantityChange,
 onDeleteItem,
}) => {
 return (
  <div className="flex md:flex-row flex-col md:items-center gap-4 py-4">
   <img
    src={item.imageUrl}
    alt={item.name}
    className="w-20 h-20 rounded-md object-cover"
   />

   <div className="flex-grow">
    <h3 className="font-semibold text-gray-800">{item.name}</h3>
    <p className="text-sm text-gray-500">{item.notes}</p>
    <p className="text-sm text-gray-500 mt-1">{item.pickupLocation}</p>
   </div>

   <div className="flex items-center gap-4">
    {/* Quantity Stepper */}
    <div className="flex items-center  ">
     <button
      onClick={() => onQuantityChange(item.id, -1)}
      className="p-1 text-black bg-[#EDEEF2] rounded-[8px]">
      <MinusIcon className="w-3 h-3" />
     </button>
     <span className="px-3 text-lg font-medium">{item.quantity}</span>
     <button
      onClick={() => onQuantityChange(item.id, 1)}
      className="p-1 text-black bg-[#EDEEF2] rounded-[8px]">
      <PlusIcon className="w-3 h-3" />
     </button>
    </div>

    {/* Price */}
    <div className="w-24 text-right">
     <p className="text-lg font-semibold text-gray-900">
      AED{item.price.toFixed(2)}
     </p>
    </div>

    {/* Delete Button */}
    <button
     onClick={() => onDeleteItem(item.id)}
     className="text-gray-400 hover:text-red-500 transition-colors">
     <img src="/images/icons/delete.svg" alt="delete" />
    </button>
   </div>
  </div>
 );
};

export default CartItem;
