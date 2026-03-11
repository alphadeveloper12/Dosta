import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { syncLocalCart } from "@/redux/slices/cartSlice";
import { Button } from "@/components/ui/button";
import Shrimmer from "../ui/Shrimmer";
import SweetsCard, {
 SweetsItemType,
 SelectedSweetsItem,
 SweetsItemVariation,
} from "./SweetsCard";

const SweetsMenu: React.FC = () => {
 const [sweetsData, setSweetsData] = useState<SweetsItemType[]>([]);
 const [cart, setCart] = useState<SelectedSweetsItem[]>([]);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);
 const [selectedItem, setSelectedItem] = useState<SweetsItemType | null>(null);
 const [selectedVariation, setSelectedVariation] =
  useState<SweetsItemVariation | null>(null);
 const [toaster, setToaster] = useState<boolean>(false);
 const [showDeliveryModal, setShowDeliveryModal] = useState<boolean>(false);
 const [deliveryAddress, setDeliveryAddress] = useState<string>("");
 const [phoneNumber, setPhoneNumber] = useState<string>("");

 const dispatch = useDispatch();
 const navigate = useNavigate();

 const baseUrl = import.meta.env.VITE_API_URL || "";
 const token =
  sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

 useEffect(() => {
  const fetchSweetsMenu = async () => {
   setLoading(true);
   try {
    const headers = token ? { Authorization: `Token ${token}` } : {};
    const res = await axios.get(`${baseUrl}/api/catering/sweets-menu/`, {
     headers,
    });

    const items: SweetsItemType[] = res.data.map((it: any) => ({
     id: it.id,
     heading: it.name,
     description: it.description,
     price: `AED ${parseFloat(it.price).toFixed(2)}`,
     imgSrc: it.image_url,
     imgAlt: `sweets-${it.id}`,
     variations: it.variations,
    }));
    setSweetsData(items);
   } catch (err) {
    console.error("Failed to fetch sweets menu", err);
    setError("Failed to load sweets menu.");
   } finally {
    setLoading(false);
   }
  };
  fetchSweetsMenu();
 }, [baseUrl, token]);

 const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
 const totalPrice = cart.reduce((sum, item) => {
  const priceNum = parseFloat(item.price.replace("AED ", ""));
  return sum + priceNum * item.quantity;
 }, 0);

 const handleCardClick = (
  item: SweetsItemType,
  variation?: SweetsItemVariation,
 ) => {
  setSelectedItem(item);
  setSelectedVariation(
   variation ||
    (item.variations && item.variations.length > 0 ? item.variations[0] : null),
  );
 };

 const handleQuantityChange = (
  e: React.MouseEvent,
  item: SweetsItemType,
  delta: number,
  variation?: SweetsItemVariation,
 ) => {
  e.stopPropagation();

  setCart((prevCart) => {
   // Use a unique ID for variation or just the item ID if no variations
   const variationId = variation?.id || 0;
   const cartItemId = `${item.id}-${variationId}`;

   const existingIndex = prevCart.findIndex(
    (i) => `${i.id}-${i.selectedVariation?.id || 0}` === cartItemId,
   );

   if (existingIndex > -1) {
    const existing = prevCart[existingIndex];
    const newQ = existing.quantity + delta;

    if (newQ <= 0) {
     return prevCart.filter((_, idx) => idx !== existingIndex);
    }

    const newCart = [...prevCart];
    newCart[existingIndex] = { ...existing, quantity: newQ };
    return newCart;
   } else if (delta > 0) {
    const itemPrice = variation
     ? `AED ${parseFloat(variation.price).toFixed(2)}`
     : item.price;
    return [
     ...prevCart,
     {
      ...item,
      price: itemPrice,
      quantity: delta,
      selectedVariation: variation,
     },
    ];
   }
   return prevCart;
  });
 };

 const submitDeliveryInfo = async () => {
  if (!deliveryAddress.trim() || !phoneNumber.trim()) {
   return;
  }

  localStorage.setItem(
   "sweetsDeliveryInfo",
   JSON.stringify({
    address: deliveryAddress,
    phone: phoneNumber,
   }),
  );

  setShowDeliveryModal(false);
  await handleConfirmOrder();
 };

 const handleConfirmOrder = async () => {
  if (cart.length === 0) return;

  const reduxCartItems = cart.map((item) => ({
   id: Math.floor(Math.random() * 1000000), // temp ID
   menu_item_id: item.id,
   menu_item: {
    id: item.id,
    name: item.selectedVariation
     ? `${item.heading} (${item.selectedVariation.weight})`
     : item.heading,
    price: item.price.replace("AED ", ""),
    image_url: item.imgSrc,
    heating: "no",
    description: item.description,
   },
   heading: item.selectedVariation
    ? `${item.heading} (${item.selectedVariation.weight})`
    : item.heading,
   imgSrc: item.imgSrc,
   price: parseFloat(item.price.replace("AED ", "")),
   quantity: item.quantity,
   day_of_week: null,
   week_number: null,
   vending_good_uuid: null,
   plan_type: "SWEETS",
   plan_subtype: "SWEETS",
  }));

  dispatch(syncLocalCart(reduxCartItems));

  // Determine current location context (mimics OrderNow behavior)
  let locId = 1;
  try {
   const selectedLocation = JSON.parse(
    localStorage.getItem("selectedLocation") || "{}",
   );
   locId = selectedLocation?.location?.id || 1;
  } catch (e) {
   locId = 1;
  }

  const payload = {
   location_id: locId,
   plan_type: "SWEETS",
   plan_subtype: "SWEETS",
   pickup_type: "TODAY",
   pickup_date: new Date().toISOString().split("T")[0],
   pickup_slot_id: null,
   items: cart.map((item) => ({
    id: item.id, // ENSURE ID IS PRESENT AT TOP LEVEL
    menu_item_id: item.id,
    variation_id: item.selectedVariation?.id || null,
    quantity: item.quantity || 1,
    day_of_week: null,
    week_number: null,
    vending_good_uuid: null,
    plan_type: "SWEETS",
    plan_subtype: "SWEETS",
    menu_item: {
     id: item.id,
     name: item.selectedVariation
      ? `${item.heading} (${item.selectedVariation.weight})`
      : item.heading,
     price: item.price.toString().replace("AED ", ""),
     image_url: item.imgSrc,
     description: item.description || "",
    },
   })),
   current_step: 4, // Roughly jump to cart review
  };

  try {
   if (token) {
    await axios.post(`${baseUrl}/api/vending/cart/`, payload, {
     headers: {
      Authorization: `Token ${token}`,
     },
    });
   } else {
    localStorage.setItem("guestCart", JSON.stringify(payload));
   }
  } catch (err) {
   console.error("❌ Sweets Cart sync error:", err);
  }

  setToaster(true);
  setTimeout(() => {
   setToaster(false);
   navigate("/vending-home/cart");
  }, 1500);
 };

 return (
  <div className="w-full flex-1 relative flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
   {/* Left Area: Main Menu */}
   <div className="flex-1">
    <div className="mb-6">
     <h2 className="text-3xl font-bold text-[#054A86] mb-2">Dosta Sweets</h2>
     <p className="text-[#545563] text-sm leading-relaxed">
      Delight in our premium selection of Middle Eastern and international
      sweets. Choose your treats below.
     </p>
    </div>

    {loading ? (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
       <div key={i} className="w-full h-[300px]">
        <Shrimmer />
       </div>
      ))}
     </div>
    ) : error ? (
     <div className="text-red-500 py-10 bg-red-50 text-center rounded-xl">
      {error}
     </div>
    ) : (
     <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {sweetsData.map((item) => {
       return (
        <SweetsCard
         key={item.id}
         data={item}
         cartItems={cart}
         handleCardClick={handleCardClick}
         handleQuantityChange={handleQuantityChange}
        />
       );
      })}
     </div>
    )}
   </div>

   {/* Right Sidebar: Selected Items & Checkout */}
   <div className="w-full lg:w-[340px] flex-shrink-0">
    <div className="bg-white rounded-[20px] p-6 sticky top-24 border border-[#EDEEF2] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)]">
     <h3 className="text-xl font-bold text-[#2B2B43] mb-6 flex justify-between items-center">
      <span>Your Sweets</span>
      <span className="text-[#054A86] bg-[#054A86]/10 px-3 py-1 rounded-full text-sm">
       {totalQuantity} items
      </span>
     </h3>

     <div className="flex flex-col gap-4 mb-8 max-h-[50vh] overflow-y-auto pr-2">
      {cart.length > 0 ? (
       cart.map((item, idx) => (
        <div
         key={`${item.id}-${item.selectedVariation?.id || idx}`}
         className="flex justify-between items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
         <div className="flex flex-col gap-1 flex-1">
          <span className="text-[#2B2B43] text-[14px] font-[600] line-clamp-1">
           {item.heading}
           {item.selectedVariation && (
            <span className="text-[10px] text-[#83859C] ml-1">
             ({item.selectedVariation.weight})
            </span>
           )}
          </span>
          <span className="text-sm font-bold text-[#054A86]">{item.price}</span>
         </div>

         {/* Quantity Stepper for Sidebar */}
         <div className="flex items-center bg-[#EDEEF2] rounded-[6px] p-0.5">
          <button
           onClick={(e) =>
            handleQuantityChange(e, item, -1, item.selectedVariation)
           }
           className="p-1 px-[6px]">
           <MinusIcon className="w-3 h-3 text-black" />
          </button>
          <span className="px-2 text-xs font-bold text-[#2B2B43]">
           {item.quantity}
          </span>
          <button
           onClick={(e) =>
            handleQuantityChange(e, item, 1, item.selectedVariation)
           }
           className="p-1 px-[6px]">
           <PlusIcon className="w-3 h-3 text-black" />
          </button>
         </div>
        </div>
       ))
      ) : (
       <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
         <svg
          className="w-8 h-8 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
           strokeLinecap="round"
           strokeLinejoin="round"
           strokeWidth={2}
           d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
         </svg>
        </div>
        <p className="text-[#83859C] text-sm">Your cart is empty.</p>
        <p className="text-[#83859C] text-xs mt-1">
         Add some delicious sweets!
        </p>
       </div>
      )}
     </div>

     <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-6">
      <span className="text-[#545563] font-medium">Total</span>
      <span className="text-[20px] font-bold text-[#2B2B43]">
       AED {totalPrice.toFixed(2)}
      </span>
     </div>

     <Button
      onClick={() => setShowDeliveryModal(true)}
      disabled={cart.length === 0}
      className={`w-full py-4 h-14 rounded-xl text-base font-bold shadow-lg transition-all
              ${
               cart.length > 0
                ? "bg-[#054A86] text-white hover:bg-[#054A86]/90 shadow-[#054A86]/25"
                : "bg-[#F7F7F9] text-[#C7C8D2] shadow-none cursor-not-allowed"
              }
            `}>
      Confirm Selection
     </Button>
    </div>
   </div>

   {/* Item Details Modal Sheet */}
   <AnimatePresence>
    {selectedItem && (
     <motion.div
      className="fixed inset-0 z-[100] flex justify-end bg-black/75 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedItem(null)}>
      <motion.div
       initial={{ x: "100%" }}
       animate={{ x: 0 }}
       exit={{ x: "100%" }}
       transition={{ type: "spring", stiffness: 250, damping: 30 }}
       onClick={(e) => e.stopPropagation()}
       data-lenis-prevent="true"
       className="bg-white w-full md:px-8 md:py-4 px-4 py-6 max-w-[500px] h-full shadow-2xl flex flex-col overflow-y-auto">
       <div className="flex items-center justify-between pb-6 md:pb-4 border-b border-gray-100 mb-6">
        <h2 className="text-[24px] md:text-[28px] leading-tight font-[700] text-[#2B2B43]">
         {selectedItem.heading}
        </h2>
        <button
         onClick={() => setSelectedItem(null)}
         className="p-2 rounded-full hover:bg-gray-100 transition-colors">
         <X className="w-5 h-5 text-gray-500" />
        </button>
       </div>

       <div className="relative aspect-[4/3] w-full rounded-[16px] overflow-hidden mb-6 bg-gray-100">
        <img
         src={selectedItem.imgSrc || "https://placehold.co/800x600?text=Sweets"}
         alt={selectedItem.imgAlt}
         className="w-full h-full object-cover"
        />
       </div>

       <div className="flex-1 space-y-4">
        <p className="text-[#545563] text-[15px] leading-relaxed">
         {selectedItem.description || "A delicious sweet treat."}
        </p>

        {/* Weight Selection in Modal */}
        {selectedItem.variations && selectedItem.variations.length > 0 && (
         <div className="pt-4">
          <h4 className="text-sm font-bold text-[#2B2B43] mb-3">
           Select Weight
          </h4>
          <div className="flex flex-wrap gap-2">
           {selectedItem.variations.map((v) => (
            <button
             key={v.id}
             onClick={() => setSelectedVariation(v)}
             className={`px-4 py-2 rounded-xl border-2 font-bold transition-all ${
              selectedVariation?.id === v.id
               ? "border-[#054A86] bg-[#054A86]/5 text-[#054A86]"
               : "border-[#EDEEF2] text-[#545563] hover:border-[#054A86]/30"
             }`}>
             <div className="text-sm">{v.weight}</div>
             <div className="text-xs opacity-70">
              AED {parseFloat(v.price).toFixed(2)}
             </div>
            </button>
           ))}
          </div>
         </div>
        )}

        <h3 className="text-[26px] leading-[32px] font-[800] tracking-[0.1px] text-[#054A86] pt-2">
         {selectedVariation
          ? `AED ${parseFloat(selectedVariation.price).toFixed(2)}`
          : selectedItem.price}
        </h3>
       </div>

       <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 md:pb-6">
        <button
         onClick={() => setSelectedItem(null)}
         className="w-full border-2 border-[#EBEBEB] text-[#545563] hover:border-[#054A86] hover:text-[#054A86] rounded-xl py-3 font-bold transition-colors">
         Close
        </button>
        <button
         onClick={(e) => {
          handleQuantityChange(
           e,
           selectedItem,
           1,
           selectedVariation || undefined,
          );
          setSelectedItem(null);
         }}
         className="w-full bg-[#054A86] text-white rounded-xl py-3 font-bold shadow-lg shadow-[#054A86]/20 transition-transform active:scale-95">
         Add to selection
        </button>
       </div>
      </motion.div>
     </motion.div>
    )}
   </AnimatePresence>

   {/* Delivery Info Modal Sheet */}
   <AnimatePresence>
    {showDeliveryModal && (
     <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowDeliveryModal(false)}>
      <motion.div
       initial={{ scale: 0.95, opacity: 0 }}
       animate={{ scale: 1, opacity: 1 }}
       exit={{ scale: 0.95, opacity: 0 }}
       transition={{ type: "spring", stiffness: 300, damping: 25 }}
       onClick={(e) => e.stopPropagation()}
       className="bg-white w-full max-w-[400px] rounded-[24px] shadow-2xl flex flex-col overflow-hidden">
       <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
         <h2 className="text-[22px] md:text-[24px] font-[700] text-[#2B2B43]">
          Delivery Details
         </h2>
         <button
          onClick={() => setShowDeliveryModal(false)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5 text-gray-500" />
         </button>
        </div>

        <p className="text-[#545563] text-[14px] mb-6">
         Please provide your delivery address and phone number to complete your
         Sweets order.
        </p>

        <div className="space-y-4">
         <div>
          <label className="block text-sm font-bold text-[#2B2B43] mb-2">
           Phone Number
          </label>
          <input
           type="tel"
           placeholder="e.g. +971 50 123 4567"
           value={phoneNumber}
           onChange={(e) => setPhoneNumber(e.target.value)}
           className="w-full h-12 px-4 rounded-xl border border-[#EDEEF2] focus:border-[#054A86] focus:ring-1 focus:ring-[#054A86] outline-none transition-all text-[#2B2B43]"
          />
         </div>

         <div>
          <label className="block text-sm font-bold text-[#2B2B43] mb-2">
           Delivery Address
          </label>
          <textarea
           placeholder="Appt, Building, Street, Area"
           value={deliveryAddress}
           onChange={(e) => setDeliveryAddress(e.target.value)}
           rows={3}
           className="w-full p-4 rounded-xl border border-[#EDEEF2] focus:border-[#054A86] focus:ring-1 focus:ring-[#054A86] outline-none transition-all text-[#2B2B43] resize-none"
          />
         </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 gap-3 flex flex-col sm:flex-row">
         <button
          onClick={() => setShowDeliveryModal(false)}
          className="w-full sm:w-[30%] border-2 border-[#EBEBEB] text-[#545563] hover:border-[#054A86] hover:text-[#054A86] rounded-xl py-3 font-bold transition-colors">
          Cancel
         </button>
         <button
          onClick={submitDeliveryInfo}
          disabled={!deliveryAddress.trim() || !phoneNumber.trim()}
          className="w-full sm:w-[70%] bg-[#054A86] text-white disabled:bg-[#C7C8D2] disabled:shadow-none disabled:cursor-not-allowed rounded-xl py-3 font-bold shadow-lg shadow-[#054A86]/20 transition-all active:scale-95">
          Continue
         </button>
        </div>
       </div>
      </motion.div>
     </motion.div>
    )}
   </AnimatePresence>

   {/* Success Toaster */}
   {toaster && (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 min-w-[320px] h-[52px] bg-[#E8F9F1] rounded-[16px] shadow-[0px_4px_15px_rgba(52,199,89,0.2)] flex items-center px-4 gap-3 z-[110] animate-in slide-in-from-top-4 fade-in duration-300">
     <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="flex-shrink-0 text-[#34C759]">
      <path
       d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
       fill="currentColor"
      />
      <path
       d="M14 6L8.5 11.5L6 9"
       stroke="white"
       strokeWidth="2"
       strokeLinecap="round"
       strokeLinejoin="round"
      />
     </svg>
     <span className="flex-grow text-[#2B2B43] font-bold text-[14px]">
      Sweets successfully confirmed!
     </span>
    </div>
   )}
  </div>
 );
};

export default SweetsMenu;
