import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Shrimmer from "../ui/Shrimmer";
import { syncLocalCart } from "@/redux/slices/cartSlice";

import BeitNahlaCard, {
 MealBoxType,
 SelectedMealBox,
} from "./BeitNahlaCard";
import OptionsDrawer, { OptionCategory } from "./OptionsDrawer";
import AddressMapModal, { AddressData } from "./AddressMapModal";

type Mode = "ORDER_NOW" | "WEEKLY";

// "13:00" -> "1:00 PM". Returns "" for blank/invalid input.
const fmt12 = (hhmm?: string) => {
 if (!hhmm) return "";
 const [h, m] = hhmm.split(":").map(Number);
 if (isNaN(h)) return hhmm;
 const period = h >= 12 ? "PM" : "AM";
 const h12 = h % 12 === 0 ? 12 : h % 12;
 return `${h12}:${(m || 0).toString().padStart(2, "0")} ${period}`;
};

interface BeitNahlaConfig {
 order_now_price: string;
 weekly_price: string;
 restaurant_name: string;
 restaurant_latitude: string;
 restaurant_longitude: string;
 max_deliverable_km: string;
 opening_time: string; // "HH:MM:SS"
 closing_time: string;
 is_open_now?: boolean;
 current_time?: string;
 tiers: Array<{
  id: number;
  label: string;
  min_km: string;
  max_km: string;
  service_charge: string;
  delivery_charge: string;
 }>;
}

const BeitNahlaMenu: React.FC = () => {
 const dispatch = useDispatch();
 const navigate = useNavigate();

 const baseUrl = import.meta.env.VITE_API_URL || "";
 const token =
  sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

 const [config, setConfig] = useState<BeitNahlaConfig | null>(null);
 const [boxes, setBoxes] = useState<MealBoxType[]>([]);
 const [categories, setCategories] = useState<OptionCategory[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const [mode, setMode] = useState<Mode>("ORDER_NOW");
 const [selections, setSelections] = useState<SelectedMealBox[]>([]); // a list — user can pick more than one box

 const [drawerOpen, setDrawerOpen] = useState(false);
 const [activeBox, setActiveBox] = useState<MealBoxType | null>(null);

 const [addressOpen, setAddressOpen] = useState(false);
 const [toast, setToast] = useState<string | null>(null);

 // Weekly = 6 days × per-day price. Order Now = single-day price.
 // e.g. weekly_price = 35 → 1 weekly box charges AED 35 × 6 = AED 210.
 const WEEKLY_DAYS = 6;
 const perDayPrice = useMemo(() => {
  if (!config) return mode === "ORDER_NOW" ? 40 : 35;
  return parseFloat(
   mode === "ORDER_NOW" ? config.order_now_price : config.weekly_price,
  );
 }, [config, mode]);
 const unitPrice = useMemo(
  () => (mode === "WEEKLY" ? perDayPrice * WEEKLY_DAYS : perDayPrice),
  [perDayPrice, mode],
 );

 useEffect(() => {
  let cancelled = false;
  const fetchAll = async () => {
   setLoading(true);
   try {
    const headers: any = token ? { Authorization: `Token ${token}` } : {};
    const [cfgRes, boxRes, optRes] = await Promise.all([
     axios.get(`${baseUrl}/api/catering/beit-nahla/config/`, { headers }),
     axios.get(`${baseUrl}/api/catering/beit-nahla/meal-boxes/`, { headers }),
     axios.get(`${baseUrl}/api/catering/beit-nahla/options/`, { headers }),
    ]);
    if (cancelled) return;
    setConfig(cfgRes.data);
    setBoxes(boxRes.data);
    setCategories(optRes.data);
   } catch (e) {
    if (!cancelled) setError("Failed to load Beit Nahla menu.");
   } finally {
    if (!cancelled) setLoading(false);
   }
  };
  fetchAll();
  return () => {
   cancelled = true;
  };
 }, [baseUrl, token]);

 // When mode changes, refresh unitPrice on existing selections
 useEffect(() => {
  setSelections((prev) => prev.map((s) => ({ ...s, unitPrice })));
 }, [unitPrice]);

 const totalQuantity = selections.length;
 const subtotal = selections.reduce((s, sel) => s + sel.unitPrice, 0);

 const isBoxSelected = (boxId: number) =>
  selections.some((s) => s.box.id === boxId);

 const handleSeeOptions = (box: MealBoxType) => {
  setActiveBox(box);
  setDrawerOpen(true);
 };

 const handleDrawerConfirm = (sel: Record<number, number[]>) => {
  if (!activeBox) return;
  setSelections((prev) => {
   const others = prev.filter((s) => s.box.id !== activeBox.id);
   return [
    ...others,
    {
     box: activeBox,
     selections: sel,
     unitPrice,
    },
   ];
  });
  setDrawerOpen(false);
  setActiveBox(null);
 };

 const removeSelection = (boxId: number) => {
  setSelections((prev) => prev.filter((s) => s.box.id !== boxId));
 };

 const handleProceed = () => {
  if (selections.length === 0) return;
  setAddressOpen(true);
 };

 const handleAddressSubmit = async (data: AddressData) => {
  setAddressOpen(false);
  const planType = "BEIT_NAHLA";
  const planSubtype = mode === "WEEKLY" ? "WEEKLY" : "NONE";

  const optionNamesByCategoryId = (catId: number, ids: number[]) => {
   const cat = categories.find((c) => c.id === catId);
   if (!cat) return [];
   return ids
    .map((id) => cat.items.find((i) => i.id === id)?.name)
    .filter(Boolean) as string[];
  };

  const buildSelectionLabel = (sel: SelectedMealBox) => {
   const parts: string[] = [];
   for (const cat of categories) {
    const ids = sel.selections[cat.id] || [];
    if (ids.length === 0) continue;
    parts.push(`${cat.name}: ${optionNamesByCategoryId(cat.id, ids).join(", ")}`);
   }
   return parts.join(" | ");
  };

  const reduxCartItems = selections.map((sel, idx) => {
   const description = buildSelectionLabel(sel);
   return {
    id: Math.floor(Math.random() * 1000000) + idx,
    menu_item_id: sel.box.id,
    menu_item: {
     id: sel.box.id,
     name: `${sel.box.name} (${mode === "WEEKLY" ? "Weekly" : "Order Now"})`,
     price: sel.unitPrice.toFixed(2),
     image_url: sel.box.image_url,
     heating: "no",
     description,
    },
    heading: sel.box.name,
    imgSrc: sel.box.image_url,
    price: sel.unitPrice,
    quantity: 1,
    day_of_week: null,
    week_number: null,
    vending_good_uuid: null,
    plan_type: planType,
    plan_subtype: planSubtype,
   };
  });

  dispatch(syncLocalCart(reduxCartItems));

  // Persist Beit Nahla items in a dedicated localStorage key. The vending
  // backend has no FK for BEIT_NAHLA boxes, so we keep them client-side and
  // cartSlice merges them into the cart on every load.
  try {
   localStorage.setItem(
    "beitNahlaCart",
    JSON.stringify({ items: reduxCartItems }),
   );
  } catch (e) {
   console.error("Failed to persist beitNahlaCart:", e);
  }

  let locId = 1;
  try {
   const selectedLocation = JSON.parse(
    localStorage.getItem("selectedLocation") || "{}",
   );
   locId = Number(selectedLocation?.location?.id) || 1;
  } catch {
   locId = 1;
  }

  const deliveryTotal = data.delivery.total_extra;

  // Persist address + delivery info for Cart/checkout
  localStorage.setItem(
   "beitNahlaDeliveryInfo",
   JSON.stringify({
    address: data.address,
    phone: data.phone,
    name: data.name,
    building: data.building,
    street: data.street,
    appt: data.appt,
    latitude: data.latitude,
    longitude: data.longitude,
    distance_km: data.delivery.distance_km,
    service_charge: data.delivery.service_charge,
    delivery_charge: data.delivery.delivery_charge,
    total_extra: deliveryTotal,
    tier_label: data.delivery.tier_label,
    mode,
   }),
  );

  const payload = {
   location_id: locId,
   plan_type: planType,
   plan_subtype: planSubtype,
   pickup_type: "TODAY",
   pickup_date: new Date().toISOString().split("T")[0],
   pickup_slot_id: null,
   city: "Dubai",
   delivery_charge: deliveryTotal,
   items: selections.map((sel) => ({
    id: sel.box.id,
    menu_item_id: sel.box.id,
    variation_id: null,
    quantity: 1,
    day_of_week: null,
    week_number: null,
    vending_good_uuid: null,
    plan_type: planType,
    plan_subtype: planSubtype,
    menu_item: {
     id: sel.box.id,
     name: `${sel.box.name} (${mode === "WEEKLY" ? "Weekly" : "Order Now"})`,
     price: sel.unitPrice.toFixed(2),
     image_url: sel.box.image_url,
     description: buildSelectionLabel(sel),
    },
   })),
   current_step: 4,
  };

  try {
   if (token) {
    await axios.post(`${baseUrl}/api/vending/cart/`, payload, {
     headers: { Authorization: `Token ${token}` },
    });
   } else {
    localStorage.setItem("guestCart", JSON.stringify(payload));
   }
  } catch (e) {
   console.error("Beit Nahla cart sync error:", e);
  }

  setToast("Beit Nahla order confirmed!");
  setTimeout(() => {
   setToast(null);
   navigate("/vending-home/cart");
  }, 1200);
 };

 // Per-day rates shown on the toggle.
 const orderNowDayPrice = config
  ? parseFloat(config.order_now_price)
  : 40;
 const weeklyDayPrice = config ? parseFloat(config.weekly_price) : 35;

 // Toggle labels — for Weekly we show "AED 35/day × 6" so the user sees
 // both the day rate AND the bundle total (= 35 × 6 = 210 AED per box).
 const orderNowPriceLabel = `AED ${orderNowDayPrice.toFixed(2)}`;
 const weeklyPriceLabel = `AED ${weeklyDayPrice.toFixed(2)}/day × ${WEEKLY_DAYS}`;
 // Per-box price actually charged (single value for the card).
 const currentPriceLabel = `AED ${unitPrice.toFixed(2)}`;

 return (
  <div className="w-full flex-1 relative flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-44 lg:pb-8 animate-fade-in-up">
   {/* Left: Boxes */}
   <div className="flex-1">
    <div className="mb-6">
     <div className="flex flex-wrap items-center gap-3 mb-2">
      <h2 className="text-3xl font-bold text-[#054A86]">Beit Nahla</h2>
      {config && (
       <span
        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
         config.is_open_now
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-700"
        }`}>
        {config.is_open_now ? "Open now" : "Closed"}
        <span className="font-medium ml-1 opacity-80">
         · {fmt12(config.opening_time?.slice(0, 5))} – {fmt12(config.closing_time?.slice(0, 5))}
        </span>
       </span>
      )}
     </div>
     <p className="text-[#545563] text-sm leading-relaxed">
      Pick your meal boxes, choose what's inside, and we'll deliver. Switch between Order Now and Weekly pricing.
     </p>
    </div>

    {/* Order Now / Weekly toggle */}
    <div className="inline-flex p-1 bg-[#EDEEF2] rounded-xl mb-6">
     <button
      onClick={() => setMode("ORDER_NOW")}
      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
       mode === "ORDER_NOW"
        ? "bg-white text-[#054A86] shadow"
        : "text-[#545563]"
      }`}>
      Order Now · {orderNowPriceLabel}
     </button>
     {/* <button
      onClick={() => setMode("WEEKLY")}
      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
       mode === "WEEKLY"
        ? "bg-white text-[#054A86] shadow"
        : "text-[#545563]"
      }`}>
      Weekly · {weeklyPriceLabel}
     </button> */}
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
    ) : boxes.length === 0 ? (
     <div className="text-[#83859C] py-10 bg-[#FAFAFD] text-center rounded-xl">
      No meal boxes available yet. Check back soon.
     </div>
    ) : (
     <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {boxes.map((box) => (
       <BeitNahlaCard
        key={box.id}
        data={box}
        priceLabel={currentPriceLabel}
        priceSuffix={
         mode === "WEEKLY"
          ? `per box · ${WEEKLY_DAYS} days`
          : "per box"
        }
        isSelected={isBoxSelected(box.id)}
        onSeeOptions={handleSeeOptions}
       />
      ))}
     </div>
    )}
   </div>

   {/* Mobile sticky bar */}
   {selections.length > 0 && (
    <div className="fixed bottom-[82px] left-0 right-0 z-40 bg-white border-t border-[#EDEEF2] px-4 py-3 shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.08)] md:hidden">
     <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
      <div className="flex flex-col">
       <span className="text-xs text-[#83859C]">
        {totalQuantity} box{totalQuantity === 1 ? "" : "es"}
       </span>
       <span className="text-lg font-bold text-[#2B2B43]">
        AED {subtotal.toFixed(2)}
       </span>
      </div>
      <Button
       onClick={handleProceed}
       className="rounded-xl px-6 py-3 h-12 text-sm font-bold shadow-lg bg-[#054A86] text-white hover:bg-[#054A86]/90 shadow-[#054A86]/25">
       Proceed
      </Button>
     </div>
    </div>
   )}

   {/* Right: Selection sidebar */}
   <div className="w-full lg:w-[340px] flex-shrink-0">
    <div className="bg-white rounded-[20px] p-6 sticky top-20 border border-[#EDEEF2] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)]">
     <h3 className="text-xl font-bold text-[#2B2B43] mb-2 flex justify-between items-center">
      <span>Your Selection</span>
      <span className="text-[#054A86] bg-[#054A86]/10 px-3 py-1 rounded-full text-sm">
       {totalQuantity} box{totalQuantity === 1 ? "" : "es"}
      </span>
     </h3>
     <p className="text-[12px] text-[#83859C] mb-4">
      {mode === "WEEKLY"
       ? "Weekly pricing applied to all boxes."
       : "Order Now pricing applied to all boxes."}
     </p>

     <div className="flex flex-col gap-4 mb-6 max-h-[50vh] overflow-y-auto pr-2">
      {selections.length > 0 ? (
       selections.map((sel) => (
        <div
         key={sel.box.id}
         className="flex justify-between items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
         <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span className="text-[#2B2B43] text-[14px] font-[600] line-clamp-1">
           {sel.box.name}
          </span>
          <span className="text-xs text-[#83859C] line-clamp-2">
           {Object.entries(sel.selections)
            .map(([catId, ids]) => {
             const cat = categories.find(
              (c) => c.id === Number(catId),
             );
             if (!cat) return "";
             const names = ids
              .map(
               (id) =>
                cat.items.find((it) => it.id === id)?.name,
              )
              .filter(Boolean);
             return names.length > 0
              ? `${cat.name}: ${names.join(", ")}`
              : "";
            })
            .filter(Boolean)
            .join(" · ")}
          </span>
          <span className="text-sm font-bold text-[#054A86] mt-1">
           AED {sel.unitPrice.toFixed(2)}
          </span>
         </div>
         <button
          onClick={() => removeSelection(sel.box.id)}
          className="p-1 px-2 rounded-md bg-[#EDEEF2] text-[#054A86] text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0">
          Remove
         </button>
        </div>
       ))
      ) : (
       <div className="text-center py-8">
        <p className="text-[#83859C] text-sm">No boxes selected.</p>
        <p className="text-[#83859C] text-xs mt-1">
         Tap "See options" on a box to begin.
        </p>
       </div>
      )}
     </div>

     <div className="space-y-2 border-t border-gray-100 pt-4 mb-4">
      <div className="flex justify-between items-center">
       <span className="text-[#545563] text-sm">Subtotal</span>
       <span className="text-[#2B2B43] font-medium">
        AED {subtotal.toFixed(2)}
       </span>
      </div>
      <p className="text-[11px] text-[#83859C]">
       Service + delivery charges are calculated from your map pin in the next step.
      </p>
     </div>

     <Button
      onClick={handleProceed}
      disabled={selections.length === 0}
      className={`w-full py-4 h-14 rounded-xl text-base font-bold shadow-lg transition-all
        ${
         selections.length > 0
          ? "bg-[#054A86] text-white hover:bg-[#054A86]/90 shadow-[#054A86]/25"
          : "bg-[#F7F7F9] text-[#C7C8D2] shadow-none cursor-not-allowed"
        }`}>
      Set Address & Continue
     </Button>
    </div>
   </div>

   {/* Drawer */}
   <OptionsDrawer
    open={drawerOpen}
    mealBox={activeBox}
    categories={categories}
    initialSelections={
     activeBox
      ? selections.find((s) => s.box.id === activeBox.id)?.selections
      : undefined
    }
    onClose={() => {
     setDrawerOpen(false);
     setActiveBox(null);
    }}
    onConfirm={handleDrawerConfirm}
   />

   {/* Address + map */}
   <AddressMapModal
    open={addressOpen}
    onClose={() => setAddressOpen(false)}
    onSubmit={handleAddressSubmit}
    defaultLat={
     config ? parseFloat(config.restaurant_latitude) : 25.2048
    }
    defaultLng={
     config ? parseFloat(config.restaurant_longitude) : 55.2708
    }
    openingTime={config?.opening_time?.slice(0, 5)}
    closingTime={config?.closing_time?.slice(0, 5)}
   />

   {/* Toast */}
   {toast && (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 min-w-[320px] h-[52px] bg-[#E8F9F1] rounded-[16px] shadow-[0px_4px_15px_rgba(52,199,89,0.2)] flex items-center px-4 gap-3 z-[120] animate-in slide-in-from-top-4 fade-in duration-300">
     <span className="flex-grow text-[#2B2B43] font-bold text-[14px]">
      {toast}
     </span>
    </div>
   )}
  </div>
 );
};

export default BeitNahlaMenu;
