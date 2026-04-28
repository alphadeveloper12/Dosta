// src/components/cart/CartPage.tsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import OrderList from "@/components/Cart/OrderList";
import OrderSummary from "@/components/Cart/OrderSummary";
import Footer from "@/components/layout/Footer";
import BreadCrumb from "@/components/home/BreadCrumb";
import Header from "./catering/components/layout/Header";

import axios from "axios";
import { useDispatch } from "react-redux";
import { syncLocalCart } from "@/redux/slices/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import MobileFooterNav from "@/components/home/MobileFooterNav";
import { Trash2, Info } from "lucide-react";
import AuthPromptModal from "@/components/common/AuthPromptModal";
import { trackPurchase } from "@/utils/metaPixel";
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
 AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Types matching Backend API
interface MenuItemAPI {
 id: number;
 name: string;
 price: string; // Decimal often returns as string
 image_url: string | null;
 description: string;
 heating?: string; // "yes" or "no"
}

interface CartItemAPI {
 id: number;
 menu_item: MenuItemAPI;
 quantity: number;
 day_of_week: string | null; // "Monday"
 week_number: number | null; // 1-4
 subtotal: number;
 vending_good_uuid: string | null;
 plan_type: string;
 plan_subtype: string;
 heating_requested?: boolean;
 variation_id?: number | null;
}

interface CartAPI {
 id: number;
 location: {
  id: number;
  name: string;
  info: string;
  serial_number?: string;
 } | null;
 plan_type: "ORDER_NOW" | "START_PLAN" | "SMART_GRAB" | "SWEETS";
 plan_subtype: "NONE" | "WEEKLY" | "MONTHLY";
 pickup_type: "TODAY" | "IN_24_HOURS" | null;
 pickup_date: string | null;
 pickup_slot: { id: number; label: string } | null;
 total_price: string;
 city?: string;
 delivery_charge?: string;
 items: CartItemAPI[];
}

// Define the type for a single cart item for type safety
export interface CartItemType {
 id: number; // Cart Item ID (not menu item id)
 menuItemId: number; // For checkout reconstruction
 name: string;
 notes: string;
 pickupLocation: string;
 imageUrl: string;
 quantity: number;
 price: number;
 dayOfWeek: string | null; // NEW: Day of week
 weekNumber: number | null; // For grouping
 vendingGoodUuid: string | null; // NEW: Good UUID
 planType: string;
 planSubtype: string;
 variationId?: number | null; // Sweets variation ID
 heating?: string; // "yes" or "no" from API
 heatingChoice?: "yes" | "no"; // User selection
 status?: string; // Fulfillment status
 pickupCode?: string | null; // Item-specific pickup code
}
const CartPage: React.FC = () => {
 // Capture payment-return state at render time — before any replaceState clears the URL
 const isPaymentReturn = useRef(
  new URLSearchParams(window.location.search).get("payment_success") === "true",
 );

 const dispatch = useDispatch();
 const [cartData, setCartData] = useState<CartAPI | null>(null);
 const [items, setItems] = useState<CartItemType[]>([]);
 const [coupon, setCoupon] = useState<string>("");
 const [loading, setLoading] = useState<boolean>(true);
 const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
 const [imageMap, setImageMap] = useState<Record<string, string>>({});
 const navigate = useNavigate();
 const baseUrl = import.meta.env.VITE_API_URL;
 const [stockMap, setStockMap] = useState<Record<string, number>>({});
 const [stockLoaded, setStockLoaded] = useState<boolean>(false);
 const [stockAlerts, setStockAlerts] = useState<string[]>([]);
 const [heatingChoices, setHeatingChoices] = useState<
  Record<number, "yes" | "no">
 >({});
 const [sweetsDeliveryInfo, setSweetsDeliveryInfo] = useState<{
  address: string;
  phone: string;
  city?: string;
 } | null>(null);
 const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
 const [retrying, setRetrying] = useState(false);
 const [retryError, setRetryError] = useState<string | null>(null);

 useEffect(() => {
  const info = localStorage.getItem("sweetsDeliveryInfo");
  if (info) {
   try {
    setSweetsDeliveryInfo(JSON.parse(info));
   } catch (e) {}
  }
 }, []);

 const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
 const [paymentError, setPaymentError] = useState<string | null>(null);
 const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
 const [showOrderTimeModal, setShowOrderTimeModal] = useState<boolean>(false);

 const token =
  sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

 const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
   try {
    setLoading(true);
    const res = await axios.post(`${baseUrl}/api/google/`, {
     access_token: tokenResponse.access_token,
    });
    const tokenResult = res.data.key ?? res.data.token;
    const userData = JSON.stringify(res.data.user);

    localStorage.setItem("authToken", tokenResult);
    localStorage.setItem("user", userData);
    sessionStorage.setItem("authToken", tokenResult);
    sessionStorage.setItem("user", userData);

    toast.success("Logged in successfully!");

    // Sync local cart to backend if items exist
    const guestCartData = localStorage.getItem("guestCart");
    if (guestCartData) {
     const payload = JSON.parse(guestCartData);
     // Ensure city and delivery_charge are passed to the backend if they exist in the guest cart
     await axios.post(`${baseUrl}/api/vending/cart/`, payload, {
      headers: { Authorization: `Token ${tokenResult}` },
     });
     localStorage.removeItem("guestCart");
    }

    window.location.reload();
   } catch (err) {
    console.error("Google Login Error:", err);
    toast.error("Failed to sign in with Google.");
   } finally {
    setLoading(false);
   }
  },
  onError: () => toast.error("Google Login Failed"),
 });

 useGoogleOneTapLogin({
  onSuccess: async (credentialResponse) => {
   try {
    setLoading(true);
    const res = await axios.post(`${baseUrl}/api/google/`, {
     id_token: credentialResponse.credential,
    });
    const tokenResult = res.data.key ?? res.data.token;
    const userData = JSON.stringify(res.data.user);

    localStorage.setItem("authToken", tokenResult);
    localStorage.setItem("user", userData);
    sessionStorage.setItem("authToken", tokenResult);
    sessionStorage.setItem("user", userData);

    toast.success("Logged in with Google!");

    // Sync local cart
    const guestCartData = localStorage.getItem("guestCart");
    if (guestCartData) {
     const payload = JSON.parse(guestCartData);
     // Ensure city and delivery_charge are passed to the backend if they exist in the guest cart
     await axios.post(`${baseUrl}/api/vending/cart/`, payload, {
      headers: { Authorization: `Token ${tokenResult}` },
     });
     localStorage.removeItem("guestCart");
    }

    window.location.reload();
   } catch (err) {
    console.error("One Tap Login Error:", err);
   } finally {
    setLoading(false);
   }
  },
  onError: () => console.log("One Tap Login Failed"),
  disabled: !!token,
 });

 const fetchCart = async () => {
  try {
   setLoading(true);
   const token =
    sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

   let cartResponseData = null;
   if (token) {
    const res = await axios.get(`${baseUrl}/api/vending/cart/`, {
     headers: { Authorization: `Token ${token}` },
    });
    cartResponseData = res.data;
   } else {
    const localCartData = localStorage.getItem("guestCart");
    if (localCartData) {
     cartResponseData = JSON.parse(localCartData);
    }
   }

   if (cartResponseData) {
    console.log("🛒 Cart Data:", cartResponseData);
    setCartData(cartResponseData);
    mapCartToUI(cartResponseData);
   }
  } catch (error) {
   console.error("Error fetching cart:", error);
   setItems([]);
  } finally {
   setLoading(false);
  }
 };

 const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
   width="24"
   height="24"
   viewBox="0 0 24 24"
   fill="none"
   xmlns="http://www.w3.org/2000/svg"
   aria-hidden="true"
   {...props}>
   <path
    d="M3.02388 16.4312L6.38721 13.8593C6.1949 13.2751 6.09091 12.6503 6.09091 12.0003C6.09091 11.3503 6.1949 10.7254 6.38721 10.1413L3.02388 7.56934C2.36791 8.90299 2 10.4066 2 12.0003C2 13.594 2.36791 15.0976 3.02388 16.4312Z"
    fill="#FBBC05"
   />
   <path
    d="M6.38677 10.141C7.16276 7.78407 9.37681 6.09091 11.9996 6.09091C13.4086 6.09091 14.6814 6.59091 15.6814 7.40909L18.5905 4.5C16.8177 2.95455 14.545 2 11.9996 2C8.04779 2 4.65001 4.2621 3.02344 7.56906L6.38677 10.141Z"
    fill="#EA4335"
   />
   <path
    d="M11.9999 21.9999C8.04707 21.9999 4.6485 19.7366 3.02246 16.4281L6.38442 13.8506C7.15795 16.2119 9.37411 17.909 11.9999 17.909C13.2848 17.909 14.4233 17.6064 15.3249 17.0374L18.5179 19.5094C16.77 21.1346 14.439 21.9999 11.9999 21.9999Z"
    fill="#34A853"
   />
   <path
    d="M12 10.1816H21.3182C21.4545 10.7725 21.5455 11.4089 21.5455 11.9998C21.5455 15.2591 20.3531 17.803 18.5179 19.5093L15.325 17.0373C16.369 16.3785 17.0953 15.3624 17.3636 14.0453H12V10.1816Z"
    fill="#4285F4"
   />
  </svg>
 );

 // Check for Payment Success redirect
 useEffect(() => {
  const verifyPaymentReturn = async () => {
   const params = new URLSearchParams(window.location.search);
   const paymentSuccess = params.get("payment_success");
   const orderId = params.get("order_id");
   const cartId = params.get("cart_id");

   if (paymentSuccess === "true" && (orderId || cartId)) {
    // Clear URL params to prevent re-trigger on refresh
    window.history.replaceState({}, document.title, window.location.pathname);

    setIsCheckingOut(true); // Show loading
    try {
     const token =
      sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

     // Handle either old order_id or new deferred cart_id
     const verifyUrl = orderId
      ? `${baseUrl}/api/vending/payment/callback/?order_id=${orderId}`
      : `${baseUrl}/api/vending/payment/callback/?order_id=CART-${cartId}`;

     const res = await axios.get(verifyUrl, {
      headers: { Authorization: `Token ${token}` },
     });

     if (res.status === 200 || res.status === 201) {
      try {
       // --- NEW: Create the Order RECORD only now ---
       // Fetch the cart data to recreate the payload
       const cartRes = await axios.get(`${baseUrl}/api/vending/cart/`, {
        headers: { Authorization: `Token ${token}` },
       });
       const currentCart = cartRes.data;

       if (currentCart && currentCart.items) {
        const purchaseValue =
         Number(currentCart.total_price) ||
         currentCart.items.reduce(
          (acc: number, item: any) =>
           acc +
           Number(item.menu_item?.price || 0) * Number(item.quantity || 0),
          0,
         );

        trackPurchase(purchaseValue, "AED");

        const checkoutItems = currentCart.items.map((it: any) => ({
         menu_item_id: it.menu_item?.id,
         quantity: it.quantity,
         day_of_week: it.day_of_week,
         week_number: it.week_number,
         vending_good_uuid: it.vending_good_uuid || null,
         heating_requested: it.heating_requested,
         plan_type: it.plan_type,
         plan_subtype: it.plan_subtype,
        }));

        // Read delivery details for Sweets
        let deliveryAdd = "";
        let custPhone = "";
        if (currentCart.plan_type === "SWEETS") {
         try {
          const sdi = JSON.parse(
           localStorage.getItem("sweetsDeliveryInfo") || "{}",
          );
          deliveryAdd = sdi.address || "";
          custPhone = sdi.phone || "";
         } catch (e) {}
        }

        const orderPayload: any = {
         location_id: currentCart.location?.id,
         plan_type: currentCart.plan_type,
         plan_subtype: currentCart.plan_subtype,
         pickup_type: currentCart.pickup_type,
         pickup_date: currentCart.pickup_date,
         pickup_slot_id: currentCart.pickup_slot?.id,
         items: checkoutItems,
         is_payment_verified: true, // SPECIAL FLAG
        };

        if (deliveryAdd && custPhone) {
         orderPayload.delivery_address = deliveryAdd;
         orderPayload.customer_phone = custPhone;
         orderPayload.city = currentCart.city;
         orderPayload.delivery_charge = currentCart.delivery_charge;
        }

        console.log("📝 Creating Deferred Order Record...");
        const orderRes = await axios.post(
         `${baseUrl}/api/vending/order/confirm/`,
         orderPayload,
         { headers: { Authorization: `Token ${token}` } },
        );

        const newOrder = orderRes.data.order;
        if (newOrder) {
         console.log("✅ Order Record Created:", newOrder.id);
         // Belt-and-suspenders: also explicitly clear backend cart
         try {
          await axios.post(
           `${baseUrl}/api/vending/cart/`,
           { clear_all: true },
           { headers: { Authorization: `Token ${token}` } },
          );
         } catch (_) {
          /* non-critical */
         }
         // Clear frontend state
         setItems([]);
         setCartData(null);
         dispatch(syncLocalCart([]));
         toast.success("Payment Successful! Order Confirmed.");
         setConfirmedOrder(newOrder);
         return; // Stay on page — show QR or retry panel
        }
       }

       // Fallback if order wasn't returned
       toast.success("Payment Successful! Redirecting...");
       navigate("/vending-home/my-orders");
      } catch (e) {
       console.error("Order creation after payment failed", e);
       toast.error(
        "Verified, but failed to create order record. Please check My Orders.",
       );
       navigate("/vending-home/my-orders");
      }
     }
    } catch (err) {
     console.error("Payment Verification Failed", err);
     toast.error("Could not verify payment. Please check 'My Orders'.");
    } finally {
     setIsCheckingOut(false);
    }
   }
  };
  verifyPaymentReturn();
 }, []);

 const handleVendingFulfillment = async (order: any) => {
  const serialNumber = order.location?.serial_number;
  if (!serialNumber) return;

  // Filter only Order Now / Smart Grab items
  const vendingItems = (order.items || []).filter(
   (item: any) =>
    item.plan_type === "ORDER_NOW" || item.plan_type === "SMART_GRAB",
  );
  if (vendingItems.length === 0) return;

  try {
   const token =
    sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

   // --- 1. Fresh Stock Validation & Update ---
   console.log("🔍 Fulfillment: Fetching fresh stock for validation...");
   const goodsResponse = await fetch(
    `${baseUrl}/api/vending/external/machine-goods/?machineUuid=${serialNumber}`,
   );
   const goodsData = await goodsResponse.json();
   const shelves = goodsData.shelves || [];

   if (shelves.length > 0) {
    // Calculate detailed usage per UUID
    const usageMap: Record<string, number> = {};
    vendingItems.forEach((item: any) => {
     if (item.vending_good_uuid) {
      usageMap[item.vending_good_uuid] =
       (usageMap[item.vending_good_uuid] || 0) + item.quantity;
     }
    });

    const goodsListToUpdate: any[] = [];
    shelves.forEach((shelf: any) => {
     if (!shelf.spots) return;
     shelf.spots.forEach((spot: any) => {
      if (
       spot.goods &&
       spot.goods.uuid &&
       !spot.goods.locked &&
       usageMap[spot.goods.uuid] > 0
      ) {
       const uuid = spot.goods.uuid;
       const needed = usageMap[uuid];
       const present = spot.presentNumber || 0;
       const take = Math.min(needed, present);

       if (take > 0) {
        const newQuantity = Math.max(0, present - take);
        goodsListToUpdate.push({
         arrivalCapacity: spot.arrivalCapacity,
         arrivalName: spot.arrivalName,
         commodityState: 0,
         equipmentUuid: serialNumber,
         goodsUuid: Number(uuid),
         presentNumber: newQuantity,
         salePrice: spot.goods.goodsPrice,
        });
        usageMap[uuid] -= take;
       }
      }
     });
    });

    if (goodsListToUpdate.length > 0) {
     console.log("🔄 Updating Stock on Machine...", goodsListToUpdate);
     await axios.put(
      `${baseUrl}/api/vending/external/update-commodity/`,
      { list: goodsListToUpdate, machineUuid: Number(serialNumber) },
      { headers: { Authorization: `Token ${token}` } },
     );
    }
   }

   // --- 2. Request Pickup Code ---
   const matchedGoods = vendingItems
    .map((item: any) => {
     if (!item.vending_good_uuid) return null;
     return {
      goodsNumber: item.quantity,
      goodsPrice: 0.01,
      goodsUuid: item.vending_good_uuid,
      heatingChoice: item.heating_requested ? "yes" : "no",
     };
    })
    .filter(Boolean);

   if (matchedGoods.length > 0) {
    const totalGoodsCount = matchedGoods.reduce(
     (acc: number, g: any) => acc + g.goodsNumber,
     0,
    );
    const now = new Date();
    const uaeOffset = 4 * 60;
    const uaeTime = new Date(
     now.getTime() + (now.getTimezoneOffset() + uaeOffset) * 60000,
    );
    const orderTimeStr = uaeTime.toISOString();

    const pickPayload = {
     goodsList: matchedGoods,
     goodsNumber: totalGoodsCount,
     machineUuid: serialNumber,
     orderNo: order.id.toString(),
     orderTime: orderTimeStr,
     timeOut: 1,
     lock: 0,
    };

    console.log("🚀 Requesting Pickup Code for Order:", order.id);
    const pickResponse = await fetch(
     `${baseUrl}/api/vending/external/production-pick/`,
     {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pickPayload),
     },
    );
    const pickData = await pickResponse.json();

    if (pickData.result === "200" && pickData.data) {
     console.log("🔑 Pickup Code Received:", pickData.data);
     const storageKey = `pickup_codes_${order.id}`;
     const codes: any = {};
     vendingItems.forEach((vi: any) => {
      if (vi.vending_good_uuid) codes[vi.vending_good_uuid] = pickData.data;
     });
     localStorage.setItem(storageKey, JSON.stringify(codes));

     await axios.post(
      `${baseUrl}/api/vending/order/update-pickup-code/`,
      { order_id: order.id, pickup_code: pickData.data },
      { headers: { Authorization: `Token ${token}` } },
     );
     console.log("✅ Pickup code saved to backend.");
    }
   }
  } catch (err) {
   console.error("Vending fulfillment step failed:", err);
  }
 };

 const processCheckout = async () => {
  if (!cartData) return;
  const serialNumber = cartData.location?.serial_number;

  // ── UAE Order Time Restriction (WEEKLY / MONTHLY / SWEETS) ──────────
  const isTimedPlan =
   cartData.plan_subtype === "WEEKLY" ||
   cartData.plan_subtype === "MONTHLY" ||
   cartData.plan_type === "SWEETS";

  if (isTimedPlan) {
   // Calculate current UAE time (UTC+4)
   const now = new Date();
   const uaeHour = new Date(
    now.getTime() + (now.getTimezoneOffset() + 4 * 60) * 60000,
   ).getHours();
   // Allow 7:00 (inclusive) → before 18:00 (exclusive)
   if (uaeHour < 7 || uaeHour >= 18) {
    setShowPaymentModal(false);
    setShowOrderTimeModal(true);
    return;
   }
  }
  // ─────────────────────────────────────────────────────────────────────

  // Auth check — show modal for guests
  const token =
   sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
  if (!token) {
   setShowAuthModal(true);
   return;
  }

  setIsCheckingOut(true);
  setPaymentError(null);

  try {
   // --- 1. Vending Machine Validation & Matching ---
   const hasOrderNowItems = items.some(
    (item) => item.planType === "ORDER_NOW" || item.planType === "SMART_GRAB",
   );

   // --- 1. Vending Machine Validation & Stock Update Preparation ---
   let stockUpdates: any[] = [];

   if (serialNumber && hasOrderNowItems) {
    try {
     console.log("🔍 Checkout: Fetching fresh stock for validation...");
     const goodsResponse = await fetch(
      `${baseUrl}/api/vending/external/machine-goods/?machineUuid=${serialNumber}`,
     );
     const goodsData = await goodsResponse.json();
     const shelves = goodsData.shelves || [];

     if (shelves.length > 0) {
      console.log(
       "📦 Checkout: Using Fresh Stock for Validation:",
       shelves.length,
       "shelves",
      );

      // Calculate detailed usage per UUID
      const usageMap: Record<string, number> = {};
      items.forEach((item) => {
       if (
        (item.planType === "ORDER_NOW" || item.planType === "SMART_GRAB") &&
        item.vendingGoodUuid
       ) {
        usageMap[item.vendingGoodUuid] =
         (usageMap[item.vendingGoodUuid] || 0) + item.quantity;
       }
      });

      // Find spots to decrement
      const goodsListToUpdate: any[] = [];

      shelves.forEach((shelf: any) => {
       if (!shelf.spots) return;
       shelf.spots.forEach((spot: any) => {
        if (
         spot.goods &&
         spot.goods.uuid &&
         !spot.goods.locked &&
         usageMap[spot.goods.uuid] > 0
        ) {
         const uuid = spot.goods.uuid;
         const needed = usageMap[uuid];
         const present = spot.presentNumber || 0;

         const take = Math.min(needed, present);

         if (take > 0) {
          const newQuantity = Math.max(0, present - take);

          // Push update payload for this spot
          goodsListToUpdate.push({
           arrivalCapacity: spot.arrivalCapacity,
           arrivalName: spot.arrivalName,
           commodityState: 0,
           equipmentUuid: serialNumber,
           goodsUuid: Number(uuid),
           presentNumber: newQuantity,
           salePrice: spot.goods.goodsPrice,
          });

          usageMap[uuid] -= take;
         }
        }
       });
      });

      stockUpdates = goodsListToUpdate;
     }
    } catch (fetchErr) {
     console.error("Error fetching fresh stock for validation", fetchErr);
    }
   }

   const token =
    sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

   // --- 2. Initiate Payment Session (DO NOT CREATE ORDER YET) ---
   console.log("💳 Initiating Payment Session for Cart...");

   const initPayload: any = { location_id: cartData.location?.id };
   if (cartData.plan_type === "SWEETS" && sweetsDeliveryInfo) {
    initPayload.delivery_address = sweetsDeliveryInfo.address;
    initPayload.customer_phone = sweetsDeliveryInfo.phone;
    initPayload.city = cartData.city;
    initPayload.delivery_charge = cartData.delivery_charge;
   }

   const payRes = await axios.post(
    `${baseUrl}/api/vending/payment/initiate/`,
    initPayload,
    { headers: { Authorization: `Token ${token}` } },
   );

   const redirectUrl = payRes.data.payment_redirect_url;

   if (redirectUrl) {
    console.log("💳 Redirecting to Payment Gateway:", redirectUrl);
    window.location.href = redirectUrl;
    return;
   }

   // Fallback for zero-price or system-error (if no redirect but logic says confirmed)
   navigate("/vending-home/my-orders");
  } catch (err: any) {
   console.error("Checkout failed", err);
   // Handle Payment Gateway Errors specially
   if (err.response && err.response.data && err.response.data.error) {
    let msg = err.response.data.error;
    if (typeof msg !== "string") msg = JSON.stringify(msg);
    setPaymentError(msg);
   } else {
    setPaymentError(
     "An unexpected error occurred during checkout. Please try again.",
    );
   }
  } finally {
   setIsCheckingOut(false);
  }
 };

 useEffect(() => {
  const fetchMenuAndCart = async () => {
   // Skip if this is a payment return — verifyPaymentReturn handles state instead
   if (isPaymentReturn.current) return;

   try {
    setLoading(true);
    const token =
     sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

    // 1. Fetch Menu for Images (non-blocking for guests)
    const newImageMap: Record<string, string> = {};
    try {
     if (token) {
      const menuRes = await axios.get(
       `${baseUrl}/api/vending/menu/ORDER_NOW/`,
       {
        headers: { Authorization: `Token ${token}` },
       },
      );
      menuRes.data.menus?.forEach((menu: any) => {
       menu.items?.forEach((it: any) => {
        if (it.image_url && !newImageMap[it.name]) {
         newImageMap[it.name] = it.image_url;
        }
       });
      });
     }
    } catch (menuErr) {
     console.warn("Menu fetch failed (non-critical):", menuErr);
    }
    setImageMap(newImageMap);

    // 2. Fetch Cart
    let cartResponseData = null;
    if (token) {
     const cartRes = await axios.get(`${baseUrl}/api/vending/cart/`, {
      headers: { Authorization: `Token ${token}` },
     });
     cartResponseData = cartRes.data;
    } else {
     const localCartData = localStorage.getItem("guestCart");
     if (localCartData) {
      cartResponseData = JSON.parse(localCartData);
     }
    }

    if (cartResponseData) {
     console.log("🛒 Cart Data:", cartResponseData);
     setCartData(cartResponseData);
     mapCartToUI(cartResponseData, newImageMap);
    }
   } catch (error) {
    console.error("Error fetching cart:", error);
    setItems([]);
   } finally {
    setLoading(false);
   }
  };

  fetchMenuAndCart();
 }, []);

 // --- Stock Check Logic ---
 useEffect(() => {
  const checkStock = async () => {
   if (!cartData?.location?.serial_number || items.length === 0) return;

   const serialNumber = cartData.location.serial_number;
   // Only check for Order Now / Smart Grab items
   const orderNowItems = items.filter(
    (i) => i.planType === "ORDER_NOW" || i.planType === "SMART_GRAB",
   );
   if (orderNowItems.length === 0) return;

   // Define reusable function to apply stock limits
   const applyStockToItems = (
    stockSource: Record<string, number>,
    sourceName: string,
   ) => {
    setStockMap((prev) => ({ ...prev, ...stockSource }));
    const alerts: string[] = [];
    let itemsChanged = false;

    const updatedItems = items.map((item) => {
     if (item.planType !== "ORDER_NOW" && item.planType !== "SMART_GRAB")
      return item;

     let available: number | undefined;

     // Try to match by UUID first
     if (
      item.vendingGoodUuid &&
      stockSource[item.vendingGoodUuid] !== undefined
     ) {
      available = stockSource[item.vendingGoodUuid];
     } else {
      // Fallback to name matching
      const normName = normalizeName(item.name);
      available = stockSource[normName];
     }

     if (available !== undefined) {
      if (item.quantity > available) {
       itemsChanged = true;
       alerts.push(
        `${item.name}: Only ${available} left (requested ${item.quantity}). Quantity updated.`,
       );
       return { ...item, quantity: available };
      }
     }
     return item;
    });

    if (itemsChanged) {
     setStockAlerts((prev) => [...prev, ...alerts]);
     setItems(updatedItems);

     // Sync updated quantities with backend
     updatedItems.forEach(async (item) => {
      const original = items.find((i) => i.id === item.id);
      if (original && original.quantity !== item.quantity) {
       try {
        const token =
         sessionStorage.getItem("authToken") ||
         localStorage.getItem("authToken");
        await axios.post(
         `${baseUrl}/api/vending/cart/`,
         {
          location_id: cartData.location.id,
          plan_type: item.planType,
          plan_subtype: item.planSubtype,
          items: [
           {
            menu_item_id: item.menuItemId,
            quantity: item.quantity,
            day_of_week: item.dayOfWeek,
            week_number: item.weekNumber,
            vending_good_uuid: item.vendingGoodUuid,
           },
          ],
         },
         { headers: { Authorization: `Token ${token}` } },
        );
       } catch (e) {
        console.error(`Failed to sync adjustment for ${item.name}`, e);
       }
      }
     });
    }
   };

   // Fetch Fresh Data
   try {
    const goodsResponse = await fetch(
     `${baseUrl}/api/vending/external/machine-goods/?machineUuid=${serialNumber}`,
    );
    const goodsData = await goodsResponse.json();

    const freshStockMap: Record<string, number> = {};
    let loadedCount = 0;

    if (goodsData.shelves && Array.isArray(goodsData.shelves)) {
     goodsData.shelves.forEach((shelf: any) => {
      if (!shelf.spots) return;
      shelf.spots.forEach((spot: any) => {
       if (!spot.goods || !spot.goods.uuid) return;
       const uuid = spot.goods.uuid;
       const name = normalizeName(spot.goods.goodsName);

       // Initialize to 0 so all items are recognized (avoids fallback)
       if (!(uuid in freshStockMap)) freshStockMap[uuid] = 0;
       if (name && !(name in freshStockMap)) freshStockMap[name] = 0;

       // Count unlocked spots — lock status is the only availability signal
       if (!spot.goods.locked) {
        freshStockMap[uuid] += 1;
        if (name) freshStockMap[name] += 1;
        loadedCount++;
       }
      });
     });
    }

    if (loadedCount === 0 && goodsData.data) {
     const allGoods = goodsData.data.flatMap((cat: any) => cat.goodsList || []);
     allGoods.forEach((good: any) => {
      const name = normalizeName(good.goodsName);
      const val = good.locked ? 0 : 1;
      freshStockMap[name] = val;
      if (good.uuid) freshStockMap[good.uuid] = val;
     });
    }

    applyStockToItems(freshStockMap, "API");
    setStockLoaded(true);
   } catch (error) {
    setStockLoaded(true); // Allow interaction even if stock check fails
    console.error("Error checking stock API:", error);
   }
  };

  checkStock();
 }, [cartData, items.length]);

 const mapCartToUI = (
  cart: CartAPI,
  currentImageMap: Record<string, string> = imageMap,
 ) => {
  const locationName = cart.location?.name || "Unknown Location";

  const mapped: CartItemType[] = (cart.items || [])
   .filter((apiItem) => apiItem && apiItem.menu_item)
   .map((apiItem) => {
    let notes = "Enjoy your meal!";

    if (
     apiItem.plan_subtype === "WEEKLY" ||
     apiItem.plan_subtype === "MONTHLY"
    ) {
     if (apiItem.day_of_week) {
      notes = `Meal for ${apiItem.day_of_week}`;
     }
    }

    return {
     id: apiItem.id,
     menuItemId: apiItem.menu_item?.id || 0,
     name: apiItem.menu_item?.name || "Unknown Item",
     notes: notes,
     pickupLocation: locationName,
     imageUrl:
      currentImageMap[apiItem.menu_item?.name || ""] ||
      apiItem.menu_item?.image_url ||
      "/images/icons/food-placeholder.svg",
     quantity: apiItem.quantity,
     price: parseFloat(apiItem.menu_item?.price || "0"),
     dayOfWeek: apiItem.day_of_week,
     weekNumber: apiItem.week_number,
     vendingGoodUuid: apiItem.vending_good_uuid,
     planType: apiItem.plan_type || cart.plan_type,
     planSubtype: apiItem.plan_subtype || cart.plan_subtype,
     variationId: apiItem.variation_id || null,
     heating: apiItem.menu_item?.heating,
     heatingChoice: apiItem.heating_requested
      ? "yes"
      : heatingChoices[apiItem.id] || "no",
    };
   });

  setItems(mapped);
  dispatch(syncLocalCart(mapped));

  if (cart.city && cart.plan_type === "SWEETS") {
   setSweetsDeliveryInfo((prev) => ({
    address: prev?.address || "",
    phone: prev?.phone || "",
    city: cart.city || prev?.city,
   }));
  }
 };

 const handleHeatingChange = (id: number, choice: "yes" | "no") => {
  setHeatingChoices((prev) => ({ ...prev, [id]: choice }));
  setItems((prev) =>
   prev.map((item) =>
    item.id === id ? { ...item, heatingChoice: choice } : item,
   ),
  );
 };

 const normalizeName = (name: string) => {
  if (!name) return "";
  let normalized = name.replace(/&/g, "and");
  return normalized.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
 };

 const getMainTitle = () => {
  if (!cartData) return "Order Now";
  if (cartData.plan_type === "SWEETS") return "Dosta Sweets";
  if (cartData.plan_type === "SMART_GRAB") return "Smart Grab";
  if (cartData.plan_subtype === "WEEKLY") return "Weekly Plan";
  if (cartData.plan_subtype === "MONTHLY") return "Monthly Plan";
  if (cartData.pickup_type === "IN_24_HOURS") return "Pickup in 24";
  return "Order Now";
 };

 const handleQuantityChange = async (id: number, delta: number) => {
  const itemToUpdate = items.find((i) => i.id === id);
  if (!itemToUpdate) return;

  let maxStock = 99; // Default for Sweets
  if (
   itemToUpdate.planType === "ORDER_NOW" ||
   itemToUpdate.planType === "SMART_GRAB"
  ) {
   if (
    itemToUpdate.vendingGoodUuid &&
    stockMap[itemToUpdate.vendingGoodUuid] !== undefined
   ) {
    maxStock = stockMap[itemToUpdate.vendingGoodUuid];
   } else {
    const normName = normalizeName(itemToUpdate.name);
    if (stockMap[normName] !== undefined) {
     maxStock = stockMap[normName];
    } else if (!stockLoaded) {
     // Stock not yet loaded — block increases
     if (delta > 0) {
      toast.info("Checking stock availability...");
      return;
     }
     maxStock = itemToUpdate.quantity;
    } else {
     maxStock = 0; // Stock loaded but uuid/name not found → treat as out of stock
    }
   }
  } else if (itemToUpdate.planType === "START_PLAN") {
   maxStock = 3;
  }

  const newQ = Math.min(maxStock, Math.max(1, itemToUpdate.quantity + delta));

  if (newQ === itemToUpdate.quantity) {
   if (itemToUpdate.quantity === maxStock && delta > 0) {
    toast.warning(`Only ${maxStock} items available.`);
   }
   return;
  }

  const updatedAllItems = items.map((item) =>
   item.id === id ? { ...item, quantity: newQ } : item,
  );
  setItems(updatedAllItems);

  const token =
   sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

  const samePlanItems = updatedAllItems.filter(
   (i) =>
    i.planType === itemToUpdate.planType &&
    i.planSubtype === itemToUpdate.planSubtype,
  );

  const apiItems = samePlanItems.map((i) => ({
   menu_item_id: i.menuItemId,
   variation_id: i.variationId || null,
   quantity: i.quantity,
   day_of_week: i.dayOfWeek,
   week_number: i.weekNumber,
   vending_good_uuid: i.vendingGoodUuid,
   heating_requested: i.heatingChoice === "yes",
   plan_type: i.planType,
   plan_subtype: i.planSubtype,
  }));

  if (token) {
   try {
    await axios.post(
     `${baseUrl}/api/vending/cart/`,
     {
      location_id: cartData?.location?.id,
      plan_type: itemToUpdate.planType,
      plan_subtype: itemToUpdate.planSubtype,
      items: apiItems,
     },
     { headers: { Authorization: `Token ${token}` } },
    );
   } catch (err) {
    console.error("Failed to sync quantity", err);
   }
  } else {
   try {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "{}");
    guestCart.items = updatedAllItems.map((i) => ({
     id: i.id,
     menu_item_id: i.menuItemId,
     variation_id: i.variationId || null,
     quantity: i.quantity,
     day_of_week: i.dayOfWeek,
     week_number: i.weekNumber,
     vending_good_uuid: i.vendingGoodUuid,
     plan_type: i.planType,
     plan_subtype: i.planSubtype,
     menu_item: {
      id: i.menuItemId,
      name: i.name,
      price: String(i.price),
      image_url: i.imageUrl,
      description: "",
     },
    }));
    localStorage.setItem("guestCart", JSON.stringify(guestCart));
   } catch (e) {
    console.error("Failed to update guest cart", e);
   }
  }
 };

 const handleDeleteItem = async (id: number) => {
  const itemToDelete = items.find((i) => i.id === id);
  if (!itemToDelete) return;

  const updatedAllItems = items.filter((i) => i.id !== id);
  setItems(updatedAllItems);
  dispatch(syncLocalCart(updatedAllItems));

  const token =
   sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

  const samePlanItems = updatedAllItems.filter(
   (i) =>
    i.planType === itemToDelete.planType &&
    i.planSubtype === itemToDelete.planSubtype,
  );

  const apiItems = samePlanItems.map((i) => ({
   menu_item_id: i.menuItemId,
   variation_id: i.variationId || null,
   quantity: i.quantity,
   day_of_week: i.dayOfWeek,
   week_number: i.weekNumber,
   vending_good_uuid: i.vendingGoodUuid,
   heating_requested: i.heatingChoice === "yes",
   plan_type: i.planType,
   plan_subtype: i.planSubtype,
  }));

  if (token) {
   try {
    await axios.post(
     `${baseUrl}/api/vending/cart/`,
     {
      location_id: cartData?.location?.id,
      plan_type: itemToDelete.planType,
      plan_subtype: itemToDelete.planSubtype,
      items: apiItems,
     },
     { headers: { Authorization: `Token ${token}` } },
    );
   } catch (err) {
    console.error("Failed to delete item", err);
    fetchCart();
   }
  } else {
   try {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "{}");
    guestCart.items = updatedAllItems.map((i) => ({
     id: i.id,
     menu_item_id: i.menuItemId,
     variation_id: i.variationId || null,
     quantity: i.quantity,
     day_of_week: i.dayOfWeek,
     week_number: i.weekNumber,
     vending_good_uuid: i.vendingGoodUuid,
     plan_type: i.planType,
     plan_subtype: i.planSubtype,
     menu_item: {
      id: i.menuItemId,
      name: i.name,
      price: String(i.price),
      image_url: i.imageUrl,
      description: "",
     },
    }));
    localStorage.setItem("guestCart", JSON.stringify(guestCart));
   } catch (e) {
    console.error("Failed to update guest cart", e);
   }
  }
 };

 const summary = useMemo(() => {
  const subtotal = items.reduce(
   (acc, item) => acc + item.price * item.quantity,
   0,
  );
  const vat = subtotal * 0.05;
  const discount = coupon.toUpperCase() === "DOSTA25" ? 25.0 : 0;
  const deliveryCharge = parseFloat(cartData?.delivery_charge || "0");
  const total = Math.max(0, subtotal + vat - discount + deliveryCharge);

  const isSweets = cartData?.plan_type === "SWEETS";
  // Only show city/delivery if items actually exist
  const city =
   items.length > 0 ? cartData?.city || sweetsDeliveryInfo?.city : undefined;

  const isMinimumMet = !isSweets || city === "Dubai" || subtotal >= 100;

  // FOOLPROOF: Derive charge from city if it's a sweets cart
  let effectiveCharge = parseFloat(cartData?.delivery_charge || "0");
  if (isSweets && city && city !== "Dubai") {
   effectiveCharge = 40;
  }

  const activeDeliveryCharge = items.length > 0 ? effectiveCharge : 0;
  const finalTotal = Math.max(
   0,
   subtotal + vat - discount + activeDeliveryCharge,
  );

  return {
   subtotal,
   vat,
   discount,
   deliveryCharge: activeDeliveryCharge,
   total: finalTotal,
   isMinimumMet,
   isSweets,
   city,
  };
 }, [
  items,
  coupon,
  cartData?.delivery_charge,
  cartData?.plan_type,
  cartData?.city,
  sweetsDeliveryInfo?.city,
 ]);

 const handleClearCart = async () => {
  try {
   const token =
    sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
   await axios.post(
    `${baseUrl}/api/vending/cart/`,
    { clear_all: true },
    { headers: { Authorization: `Token ${token}` } },
   );
   setItems([]);
   dispatch(syncLocalCart([]));
  } catch (err) {
   console.error("Failed to clear cart", err);
  }
 };

 const getGroupedCartItems = () => {
  const groups: {
   title: string;
   items: CartItemType[];
   groupedItems?: any[];
  }[] = [];

  const orderNowItems = items.filter(
   (i) => i.planType === "ORDER_NOW" || i.planType === "SMART_GRAB",
  );
  if (orderNowItems.length > 0) {
   groups.push({ title: "Order Now", items: orderNowItems });
  }

  const sweetsItems = items.filter((i) => i.planType === "SWEETS");
  if (sweetsItems.length > 0) {
   groups.push({ title: "Dosta Sweets", items: sweetsItems });
  }

  const weeklyItems = items.filter(
   (i) => i.planType === "START_PLAN" && i.planSubtype === "WEEKLY",
  );
  if (weeklyItems.length > 0) {
   groups.push({ title: "Weekly Plan", items: weeklyItems });
  }

  const monthlyItems = items.filter(
   (i) => i.planType === "START_PLAN" && i.planSubtype === "MONTHLY",
  );
  if (monthlyItems.length > 0) {
   const weeks = [1, 2, 3, 4];
   const monthlyGroups: any[] = [];
   for (const week of weeks) {
    const weekItems = monthlyItems.filter((i) => i.weekNumber === week);
    if (weekItems.length > 0) {
     monthlyGroups.push({ title: `Week ${week}`, items: weekItems });
    }
   }
   const extras = monthlyItems.filter((i) => !i.weekNumber);
   if (extras.length > 0) {
    monthlyGroups.push({ title: "Other Items", items: extras });
   }
   groups.push({
    title: "Monthly Plan",
    items: [],
    groupedItems: monthlyGroups,
   });
  }

  return groups;
 };

 const handleRetryFulfillment = async () => {
  if (!confirmedOrder) return;
  const token =
   sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
  setRetrying(true);
  setRetryError(null);
  try {
   const res = await axios.post(
    `${baseUrl}/api/vending/order/${confirmedOrder.id}/retry-fulfillment/`,
    {},
    { headers: { Authorization: `Token ${token}` } },
   );
   const updatedOrder = { ...confirmedOrder, ...res.data };
   // Fetch fresh order to get latest status/pickup_code
   const orderRes = await axios.get(`${baseUrl}/api/vending/orders/`, {
    headers: { Authorization: `Token ${token}` },
   });
   const fresh = (orderRes.data as any[]).find(
    (o: any) => o.id === confirmedOrder.id,
   );
   setConfirmedOrder(fresh || updatedOrder);
   if (!fresh?.pickup_code && !res.data.pickup_code) {
    setRetryError(
     "Still couldn't generate pickup code. Please try again or contact support.",
    );
   }
  } catch (err: any) {
   setRetryError(
    err.response?.data?.error || "Retry failed. Please try again.",
   );
  } finally {
   setRetrying(false);
  }
 };

 // POST-PAYMENT PANEL: show QR or retry instead of cart when order is confirmed
 if (confirmedOrder) {
  const isPendingFulfillment = confirmedOrder.status === "PENDING_FULFILLMENT";
  const isReady =
   confirmedOrder.status === "READY" || !!confirmedOrder.pickup_code;

  return (
   <div className="bg-gray-50 min-h-screen max-md:pb-[82px]">
    <Header />
    <div className="w-full bg-white pt-2 pb-6">
     <div className="main-container">
      <BreadCrumb />
      <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
       Order Confirmed
      </h2>
     </div>
    </div>
    <div className="main-container py-10 flex flex-col items-center">
     <div className="bg-white rounded-2xl border border-[#EDEEF2] w-full max-w-md p-8 shadow-sm text-center">
      <p className="text-[13px] text-[#83859C] mb-1 uppercase tracking-wider font-semibold">
       Order #{confirmedOrder.id}
      </p>

      {isReady && !isPendingFulfillment ? (
       <>
        <div className="text-4xl mb-3">🎉</div>
        <p className="text-[20px] font-[700] text-[#054A86] mb-1">
         Your order is ready!
        </p>
        <p className="text-sm text-[#83859C] mb-6">
         Scan the QR code at the vending machine to collect your food.
        </p>
        <div className="flex justify-center mb-4">
         <div className="rounded-[16px] border border-[#83859C] w-[180px] h-[180px] p-3 bg-white shadow-sm flex items-center justify-center">
          <img
           src={
            confirmedOrder.qr_code_url ||
            `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${confirmedOrder.pickup_code}`
           }
           alt="QR Code"
           className="w-full h-full object-contain"
          />
         </div>
        </div>
        <p className="text-sm text-[#83859C] font-semibold uppercase tracking-wider mb-1">
         Pickup Code
        </p>
        <p className="text-[32px] font-bold text-[#054A86] mb-6">
         {confirmedOrder.pickup_code}
        </p>
       </>
      ) : (
       <>
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-[18px] font-[700] text-orange-700 mb-1">
         Payment Confirmed
        </p>
        <p className="text-sm text-orange-600 mb-5">
         Your payment was successful but we couldn't generate your pickup code
         automatically. You can retry below or check My Orders later.
        </p>
        {retryError && (
         <p className="text-sm text-red-600 font-semibold mb-3">{retryError}</p>
        )}
        <button
         onClick={handleRetryFulfillment}
         disabled={retrying || confirmedOrder.fulfillment_attempts >= 5}
         className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl mb-3 transition-colors">
         {retrying ? "Retrying..." : "🔄 Retry Pickup Code"}
        </button>
        {confirmedOrder.fulfillment_attempts >= 5 && (
         <p className="text-xs text-gray-500 mb-3">
          Maximum retries reached. Please contact support.
         </p>
        )}
       </>
      )}

      <button
       onClick={() => navigate("/vending-home/my-orders")}
       className="w-full border border-[#054A86] text-[#054A86] font-semibold py-3 rounded-xl hover:bg-[#F6FBFF] transition-colors">
       View My Orders
      </button>
     </div>
    </div>
    <MobileFooterNav />
    <Footer />
   </div>
  );
 }

 return (
  <div className="bg-gray-50 min-h-screen max-md:pb-[82px]">
   <Header />
   <div className="w-full bg-white pt-2 pb-6">
    <div className="main-container">
     <BreadCrumb />
     <div className="flex justify-between items-center">
      <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
       {getMainTitle()}
      </h2>
      {items.length > 0 && (
       <AlertDialog>
        <AlertDialogTrigger asChild>
         <button className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-2 transition-colors">
          <Trash2 className="w-5 h-5" />
          <span>Clear Cart</span>
         </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
         <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
           This action cannot be undone. This will permanently remove all items
           from your cart.
          </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
           onClick={handleClearCart}
           className="bg-red-500 hover:bg-red-600">
           Clear Cart
          </AlertDialogAction>
         </AlertDialogFooter>
        </AlertDialogContent>
       </AlertDialog>
      )}
     </div>
    </div>
   </div>

   <div className="main-container ">
    {loading ? (
     <div className="py-10 text-center">Loading cart...</div>
    ) : (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start py-6">
      <div className="lg:col-span-2 space-y-6">
       {!token && items.length > 0 && (
        <div className="bg-[#EAF5FF] border border-[#054A86] rounded-[16px] p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-full shadow-sm">
           <Info className="w-6 h-6 text-[#054A86]" />
          </div>
          <div>
           <h3 className="text-[#054A86] font-[800] text-[18px]">
            Guest Checkout
           </h3>
           <p className="text-[#545563] text-[14px]">
            Log in now to save your progress and complete your order.
           </p>
          </div>
         </div>
         <button
          onClick={() => googleLogin()}
          className="flex items-center gap-3 bg-white hover:bg-gray-50 text-[#2B2B43] font-[700] px-6 py-3 rounded-[12px] border border-[#EDEEF2] shadow-sm transition-all">
          <GoogleIcon></GoogleIcon>
          Continue with Google
         </button>
        </div>
       )}
       {summary.isSweets &&
        !summary.isMinimumMet &&
        summary.city !== "Dubai" && (
         <div className="bg-orange-50 border border-orange-200 rounded-[16px] p-4 mb-6 flex items-start gap-3 shadow-sm">
          <div className="bg-orange-100 p-2 rounded-full">
           <Info className="w-5 h-5 text-orange-600" />
          </div>
          <div>
           <h4 className="text-orange-800 font-bold text-[16px]">
            Minimum Order Requirement
           </h4>
           <p className="text-orange-700 text-sm">
            Dosta Sweets orders require a minimum subtotal of **AED 100.00**.
            Current subtotal: **AED {summary.subtotal.toFixed(2)}**.
           </p>
          </div>
         </div>
        )}
       {stockAlerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
         <h4 className="text-yellow-800 font-bold mb-2">Stock Updates</h4>
         <ul className="list-disc list-inside text-yellow-700 text-sm">
          {stockAlerts.map((alert, i) => (
           <li key={i}>{alert}</li>
          ))}
         </ul>
        </div>
       )}
       {getGroupedCartItems().map((group, idx) => (
        <div key={idx} className="flex flex-col gap-4">
         {group.title === "Dosta Sweets" && (
          <div className="mb-2 overflow-hidden rounded-[16px] bg-[#054A86] relative h-12 flex items-center shadow-lg">
           <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#054A86] to-transparent z-10" />
           <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#054A86] to-transparent z-10" />

           <motion.div
            className="flex whitespace-nowrap gap-12 text-white font-[700] text-[15px] items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
             repeat: Infinity,
             duration: 20,
             ease: "linear",
            }}>
            <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
             Your Dosta Sweets order will be delivered within 24 hours
            </div>
            <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
             Your Dosta Sweets order will be delivered within 24 hours
            </div>
            <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
             Your Dosta Sweets order will be delivered within 24 hours
            </div>
            <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
             Your Dosta Sweets order will be delivered within 24 hours
            </div>
           </motion.div>
          </div>
         )}

         {group.title === "Dosta Sweets" && sweetsDeliveryInfo && (
          <div className="bg-[#F8FAFC] border border-[#EDEEF2] rounded-[16px] p-5 flex flex-col gap-2 shadow-sm mb-2">
           <h3 className="text-[18px] font-[700] text-[#054A86] mb-1">
            Delivery Details
           </h3>
           <div className="flex items-start gap-2">
            <span className="text-[#83859C] text-sm font-medium w-20">
             Address:
            </span>
            <span className="text-[#2B2B43] text-sm font-bold flex-1">
             {sweetsDeliveryInfo.address}
            </span>
           </div>
           <div className="flex items-start gap-2">
            <span className="text-[#83859C] text-sm font-medium w-20">
             Phone:
            </span>
            <span className="text-[#2B2B43] text-sm font-bold flex-1">
             {sweetsDeliveryInfo.phone}
            </span>
           </div>
          </div>
         )}
         <OrderList
          title={group.title}
          items={group.items}
          groupedItems={group.groupedItems}
          onQuantityChange={handleQuantityChange}
          onDeleteItem={handleDeleteItem}
          onHeatingChange={handleHeatingChange}
         />
        </div>
       ))}
       {items.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-10 text-center">
         <p className="text-gray-500">Your cart is empty.</p>
         <Link
          to="/vending-home"
          className="text-[#054A86] font-bold mt-4 inline-block">
          Go Shopping
         </Link>
        </div>
       )}
      </div>

      <div className="lg:col-span-1">
       <OrderSummary
        subtotal={summary.subtotal}
        vat={summary.vat}
        discount={summary.discount}
        deliveryCharge={summary.deliveryCharge}
        city={summary.city}
        total={summary.total}
        coupon={coupon}
        setCoupon={setCoupon}
        onCheckout={async () => {
         if (!cartData || isCheckingOut || !summary.isMinimumMet) return;
         const token =
          sessionStorage.getItem("authToken") ||
          localStorage.getItem("authToken");
         if (!token) {
          setShowAuthModal(true);
          return;
         }
         setPaymentError(null);
         setShowPaymentModal(true);
        }}
        loading={isCheckingOut}
        disabled={items.length === 0 || !summary.isMinimumMet}
       />
      </div>
     </div>
    )}
   </div>

   <AlertDialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
    <AlertDialogContent>
     <AlertDialogHeader>
      <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
      <AlertDialogDescription>
       You are about to be redirected to our secure payment gateway to complete
       your purchase.
       {paymentError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
         <strong>Payment Error:</strong> {paymentError}
        </div>
       )}
      </AlertDialogDescription>
     </AlertDialogHeader>
     <AlertDialogFooter>
      <AlertDialogCancel onClick={() => setShowPaymentModal(false)}>
       Cancel
      </AlertDialogCancel>
      <AlertDialogAction
       onClick={async (e) => {
        e.preventDefault();
        await processCheckout();
       }}
       className="bg-[#054A86] hover:bg-[#043d6e]"
       disabled={isCheckingOut}>
       {isCheckingOut ? "Processing..." : "Confirm & Pay"}
      </AlertDialogAction>
     </AlertDialogFooter>
    </AlertDialogContent>
   </AlertDialog>

   <div className="max-md:hidden">
    <Footer />
   </div>
   <MobileFooterNav />
   <AuthPromptModal
    isOpen={showAuthModal}
    onClose={() => setShowAuthModal(false)}
    message="Please log in to proceed to checkout. Don't have an account? Sign up for free!"
   />

   {/* ── Order Time Restriction Modal (WEEKLY / MONTHLY) ── */}
   {showOrderTimeModal && (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
     <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-[#054A86] to-indigo-700 px-6 pt-8 pb-10 text-white text-center relative">
       <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_#ffffff_0%,_transparent_60%)]"></div>
       <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
         <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
           strokeLinecap="round"
           strokeLinejoin="round"
           strokeWidth={2}
           d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
         </svg>
        </div>
        <h3 className="text-xl font-extrabold tracking-tight mb-1">
         Ordering Hours
        </h3>
        <p className="text-white/75 text-sm">Plan orders have a daily window</p>
       </div>
      </div>

      {/* Overlap card */}
      <div className="-mt-6 mx-4 bg-white rounded-2xl shadow-lg border border-gray-100 px-5 pt-10 pb-6 text-center mb-2">
       <p className="text-3xl font-black text-[#054A86] tracking-tight">
        7:00 AM – 6:00 PM
       </p>
       <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
        UAE Time (UTC+4)
       </p>
      </div>

      {/* Body */}
      <div className="px-6 pt-2 pb-6 text-center space-y-3">
       <p className="text-gray-600 text-sm leading-relaxed">
        <strong className="text-gray-800">Weekly, Monthly & Sweets</strong>{" "}
        orders can only be placed between 7:00 AM and 6:00 PM UAE time.
       </p>
       <p className="text-gray-500 text-xs">
        Your current UAE time is{" "}
        <span className="font-bold text-gray-700">
         {new Date(
          new Date().getTime() +
           (new Date().getTimezoneOffset() + 4 * 60) * 60000,
         ).toLocaleTimeString("en-AE", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
         })}
        </span>
       </p>
       <p className="text-gray-400 text-xs">
        <span className="font-medium text-gray-500">Order Now</span>
        items are available at any time.
       </p>

       <button
        type="button"
        onClick={(e) => {
         e.preventDefault();
         setShowOrderTimeModal(false);
        }}
        className="w-full cursor-pointer mt-2 py-3 rounded-2xl bg-[#054A86] text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-blue-200 active:scale-[0.98]">
        Got it, I'll come back later
       </button>
      </div>
     </div>
    </div>
   )}
  </div>
 );
};

export default CartPage;
