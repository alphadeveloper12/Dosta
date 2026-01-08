// src/components/cart/OrderedItem.tsx
import React from "react";
import { CartItemType } from "@/pages/CartPage";

interface OrderedItemProps {
    item: CartItemType;
    pickupCode?: string | null;
    isOrderInProgress?: boolean;
}

const OrderedItem: React.FC<OrderedItemProps> = ({ item, pickupCode, isOrderInProgress }) => {
    return (
        <div className="flex flex-row md:items-start gap-4 py-4">
            <img
                src={item.imageUrl}
                alt={item.name}
                className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] rounded-lg object-cover flex-shrink-0"
            />

            <div className="flex flex-col w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-[16px] leading-[24px] font-[700] text-[#2B2B43]">
                            {item.name}
                        </h3>
                        <div className="flex flex-col gap-0.5 mt-1">
                            {item.notes && (
                                <p className="text-[12px] leading-[16px] font-[500] text-[#545563]">
                                    {item.notes}
                                </p>
                            )}
                            <p className="text-[12px] leading-[16px] font-[500] text-[#545563]">
                                Pickup at:{" "}
                                <span className="font-[600] text-[#2B2B43]">{item.pickupLocation}</span>
                            </p>
                        </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                        <div className="flex gap-[26px]">
                            <span className="text-[16px] leading-[24px] font-[500] text-[#83859C]">
                                x {item.quantity}
                            </span>
                            <p className="text-[16px] leading-[24px] font-[700] text-[#2B2B43]">
                                AED{item.price.toFixed(2)}
                            </p>
                        </div>

                        {/* Pickup Code or Processing Status */}
                        {pickupCode ? (
                            <div className="mt-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg px-3 py-1">
                                <p className="text-[12px] font-bold text-[#15803D]">
                                    Pickup Code: <span className="text-[14px] tracking-wider">{pickupCode}</span>
                                </p>
                            </div>
                        ) : isOrderInProgress ? (
                            <div className="mt-2 bg-[#F4F4F5] border border-[#E4E4E7] rounded-full px-4 py-1">
                                <p className="text-[12px] font-medium text-[#71717A]">
                                    Processing...
                                </p>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderedItem;
