import { useEffect, useState } from "react";
import locationimg from "@/assets/../../public/images/icons/locaion-icon.svg";
import calendar from "@/assets/../../public/images/icons/calendar.svg";
import { Button } from "./catering/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import BreadCrumb from "@/components/home/BreadCrumb";
import OrderedItem from "@/components/Cart/OrderedItem"; // Use new OrderedItem
import MobileFooterNav from "@/components/home/MobileFooterNav";
import Header from "./catering/components/layout/Header";
import VendingMap from "@/components/vending_home/VendingMap";
import axios from "axios";
import { CartItemType } from "@/pages/CartPage";
import Shrimmer from "@/components/ui/Shrimmer";

// Types corresponding to Backend Order Serializer
interface OrderItemAPI {
  id: number;
  menu_item: {
    id: number;
    name: string;
    price: string;
    image_url: string | null;
    description: string;
  };
  quantity: number;
  day_of_week: string | null;
  week_number: number | null;
  status: string;
  pickup_code: string | null;
  qr_code_url: string | null;
  plan_type: string;
  plan_subtype: string;
}

interface OrderAPI {
  id: number;
  status: string; // PENDING, CONFIRMED, READY, COMPLETED, PENDING_FULFILLMENT, etc.
  created_at: string;
  total_amount: string;
  location: {
    id: number;
    name: string;
    info: string;
    position: { lat: number; lng: number };
  };
  plan_type: string;
  plan_subtype: string;
  pickup_date: string | null;
  pickup_slot: {
    id: number;
    start_time: string;
    end_time: string;
    label: string;
  } | null;
  pickup_code: string | null;
  qr_code_url: string | null;
  qr_used: boolean;
  fulfillment_attempts: number;
  items: OrderItemAPI[];
}

const MyOrders = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState<OrderAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderAPI | null>(null);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);

  const handleRetryFulfillment = async (orderId: number) => {
    const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
    setRetrying(true);
    setRetryError(null);
    try {
      const res = await axios.post(
        `${baseUrl}/api/vending/order/${orderId}/retry-fulfillment/`,
        {},
        { headers: { Authorization: `Token ${token}` } },
      );
      // Refresh orders list to reflect the new pickup code / status
      const ordersRes = await axios.get(`${baseUrl}/api/vending/orders/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setOrders(ordersRes.data);
      const updated = ordersRes.data.find((o: OrderAPI) => o.id === orderId);
      if (updated) setSelectedOrder(updated);
      if (!res.data.pickup_code) {
        setRetryError("Still could not generate pickup code. Please try again or contact support.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || "Retry failed. Please try again.";
      setRetryError(msg);
    } finally {
      setRetrying(false);
    }
  };

  // Derive step from selected order status
  const getStepFromStatus = (status: string) => {
    if (["READY", "COMPLETED", "PICKED_UP"].includes(status)) return 2;
    return 1;
  };

  const currentStep = selectedOrder
    ? getStepFromStatus(selectedOrder.status)
    : 1;

  const [stopPolling, setStopPolling] = useState(false);

  // Fetch Orders with Polling
  useEffect(() => {
    const fetchOrders = async () => {
      if (stopPolling) return; // Fail-safe: Stop fetching if terminal status hit

      try {
        const token =
          sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
        const res = await axios.get(`${baseUrl}/api/vending/orders/`, {
          headers: { Authorization: `Token ${token}` },
        });

        const allOrders = res.data;
        setOrders(allOrders);

        if (allOrders.length > 0) {
          const firstOrder = allOrders[0];
          // If the most recent order is Order Now and already READY/COMPLETED,
          // we can stop polling to avoid any potential "toggling" regressions.
          const isInstant =
            firstOrder.plan_type === "ORDER_NOW" ||
            firstOrder.plan_type === "SMART_GRAB";
          const isTerminal = ["READY", "COMPLETED", "PICKED_UP"].includes(
            firstOrder.status,
          );

          if (isInstant && isTerminal) {
            console.log(
              "🛑 Order reached terminal status. Stopping polling as requested.",
            );
            setStopPolling(true);
          }

          if (selectedOrder) {
            const updated = allOrders.find(
              (o: OrderAPI) => o.id === selectedOrder.id,
            );
            if (updated) setSelectedOrder(updated);
            else setSelectedOrder(allOrders[0]);
          } else {
            setSelectedOrder(allOrders[0]);
          }
        } else {
          setSelectedOrder(null);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [baseUrl, selectedOrder?.id, stopPolling]);

  // Helper to normalize names for "spelling-only" comparison
  const normalizeName = (name: string) => {
    if (!name) return "";
    let normalized = name.replace(/&/g, "and");
    return normalized.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  };

  // Fetch Menu for Images
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const selectedLocation = JSON.parse(
          localStorage.getItem("selectedLocation") || "{}",
        );
        const locId = Number(selectedLocation?.location?.id) || 1;

        const token =
          sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
        const res = await axios.get(`${baseUrl}/api/vending/menu/ORDER_NOW/?location_id=${locId}`, {
          headers: { Authorization: `Token ${token}` },
        });
        const newImageMap: Record<string, string> = {};
        res.data.menus?.forEach((menu: any) => {
          menu.items?.forEach((it: any) => {
            if (it.image_url) {
              // Map both raw logic and normalized logic to be safe
              newImageMap[it.name] = it.image_url;
              newImageMap[normalizeName(it.name)] = it.image_url;
            }
          });
        });
        setImageMap(newImageMap);
      } catch (error) {
        console.error("Error fetching menu for images:", error);
      }
    };
    fetchMenu();
  }, [baseUrl]);

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to Map Order Items to UI format
  const getMappedItems = (order: OrderAPI): CartItemType[] => {
    const locationName = order.location?.name || "Unknown Location";
    return order.items.map((apiItem) => {
      let notes = "";
      if (order.plan_subtype === "WEEKLY" || order.plan_subtype === "MONTHLY") {
        if (apiItem.day_of_week) {
          notes = `Meal for ${apiItem.day_of_week}`;
        }
      }

      return {
        id: apiItem.id,
        menuItemId: apiItem.menu_item.id,
        name: apiItem.menu_item.name,
        notes: notes,
        pickupLocation: locationName,
        imageUrl:
          apiItem.menu_item.image_url ||
          imageMap[apiItem.menu_item.name] ||
          imageMap[normalizeName(apiItem.menu_item.name)] ||
          "/images/vending_home/food.svg",
        quantity: apiItem.quantity,
        dayOfWeek: apiItem.day_of_week,
        price: parseFloat(apiItem.menu_item.price),
        weekNumber: apiItem.week_number,
        vendingGoodUuid: null, // Not used in MyOrders but required by type
        planType: apiItem.plan_type, // STOP fallback to order.plan_type to identify data issues
        planSubtype: apiItem.plan_subtype,
        status: apiItem.status,
        pickupCode: apiItem.pickup_code,
        qrCodeUrl: apiItem.qr_code_url,
      };
    });
  };

  // Group items logic (Same as CartPage)
  const getGroupedItems = (order: OrderAPI) => {
    const items = getMappedItems(order);
    const groups: { title: string; items: CartItemType[] }[] = [];

    // 1. Group Plan Items (Weekly/Monthly)
    const planItems = items.filter((i) => i.planType === "START_PLAN");
    if (planItems.length > 0) {
      const planSubtype = planItems[0].planSubtype;
      if (planSubtype === "MONTHLY") {
        const weeks = [1, 2, 3, 4];
        for (const week of weeks) {
          const weekItems = planItems.filter((i) => i.weekNumber === week);
          if (weekItems.length > 0) {
            groups.push({
              title: `Monthly Plan - Week ${week}`,
              items: weekItems,
            });
          }
        }
      } else if (planSubtype === "WEEKLY") {
        groups.push({
          title: "Weekly Plan Items",
          items: planItems,
        });
      } else {
        groups.push({
          title: "Meal Plan Items",
          items: planItems,
        });
      }
    }

    // 2. Group Order Now / Smart Grab Items
    const instantItems = items.filter((i) => i.planType !== "START_PLAN");
    if (instantItems.length > 0) {
      groups.push({
        title: "Order Now Items",
        items: instantItems,
      });
    }

    return groups.length > 0 ? groups : [{ title: "Order Details", items }];
  };

  if (loading) {
    return (
      <div className="w-full">
        <Shrimmer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Breadcrumbs and title section  */}
      <div className="w-full bg-white pt-2 pb-6">
        <div className="main-container">
          <BreadCrumb />
          <h2 className="text-[28px] text-[#054A86] leading-[36px] font-[700] tracking-[0.1px]">
            My Orders
          </h2>
        </div>
      </div>
      <main className="flex-1 bg-background max-md:pb-24">
        <div className="main-container !py-6 ">
          {!selectedOrder ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-[#2B2B43]">
                  No Active Orders Found
                </h3>
                <p className="text-[#83859C] mt-2 mb-6">
                  Looks like you don't have any orders in progress.
                </p>
                <Button onClick={() => navigate("/vending-home")} className="px-8">
                  Start Ordering
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] md:grid-cols-[250px_1fr] gap-4 md:gap-[30px]">
              {/* LEFT: Order List Sidebar */}
              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 hidden md:block">
                <h3 className="text-lg font-bold text-[#2B2B43] mb-4">Order History</h3>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedOrder.id === order.id
                        ? "border-[#054A86] bg-[#F6FBFF] shadow-sm"
                        : "border-[#EDEEF2] bg-white hover:border-gray-300"
                      }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-[#2B2B43]">Order #{order.id}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          order.status === "COMPLETED" || order.status === "PICKED_UP" || order.qr_used
                            ? "bg-green-100 text-green-700"
                            : order.status === "READY"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "PENDING_FULFILLMENT"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                        {order.status === "PENDING_FULFILLMENT" ? "⚠️ Action Needed" : order.qr_used ? "Delivered" : order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#83859C]">
                      {formatDate(order.created_at)}
                    </p>
                    <p className="text-sm font-semibold mt-2 text-[#054A86]">
                      AED {parseFloat(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* MIDDLE: Booking Card + Details */}
              <div className="space-y-4">
                {/* Mobile Order Selector (Horizontal Scroll) */}
                <div className="md:hidden flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`flex-shrink-0 p-3 rounded-xl border min-w-[140px] ${selectedOrder.id === order.id
                          ? "border-[#054A86] bg-[#F6FBFF]"
                          : "border-[#EDEEF2] bg-white"
                        }`}>
                      <p className="font-bold text-sm">Order #{order.id}</p>
                      <p className="text-[10px] text-[#83859C] truncate">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Booking Header Card */}
                <div className="rounded-2xl border border-[#EDEEF2] bg-white">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div className="flex w-full flex-col md:flex-row gap-1">
                      <div className="flex flex-col justify-between gap-3 w-full">
                        <p className="text-[24px] font-bold leading-8 text-#2B2B43">
                          Order ID {selectedOrder.id}
                        </p>
                      </div>
                      <div className="flex md:items-end items-start max-md:pt-4 flex-col  gap-3 w-full">
                        <div className="flex max-md:flex-row-reverse gap-2 items-center">
                          <p className="text-xs font-semibold leading-[16px] text-[#83859C]">
                            Location at {selectedOrder.location?.name}
                          </p>
                          <img
                            src={locationimg}
                            alt="location Icon"
                            className="w-[16px] h-[16px]"
                          />
                        </div>
                        <div className="flex gap-2 items-center max-md:flex-row-reverse">
                          <p className="text-xs font-semibold leading-[16px] text-[#83859C]">
                            {formatDate(selectedOrder.created_at)}
                          </p>
                          <img
                            src={calendar}
                            alt="calendar Icon"
                            className="w-[16px] h-[16px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info note */}
                  {/* Info note removed */}

                  {/* Stuck PENDING / CONFIRMED — payment likely taken but order never advanced to READY */}
                  {(selectedOrder.status === "PENDING" || selectedOrder.status === "CONFIRMED") && !selectedOrder.pickup_code && (
                    <div className="flex flex-col items-center md:py-[40px] py-[24px] border-t border-yellow-100 mt-4 px-4 bg-yellow-50 rounded-b-2xl">
                      <div className="text-4xl mb-3">⏳</div>
                      <p className="text-[16px] font-[700] text-yellow-800 text-center mb-1">
                        Order Processing
                      </p>
                      <p className="text-sm text-yellow-700 text-center mb-5 max-w-sm">
                        Your order is still being processed. If you have already paid, tap the button below to generate your pickup code.
                      </p>
                      {retryError && (
                        <p className="text-sm text-red-600 font-semibold mb-3 text-center">{retryError}</p>
                      )}
                      <button
                        onClick={() => handleRetryFulfillment(selectedOrder.id)}
                        disabled={retrying || selectedOrder.fulfillment_attempts >= 5}
                        className="bg-[#054A86] hover:bg-blue-800 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                        {retrying ? "Processing..." : "🔄 Get My Pickup Code"}
                      </button>
                      {selectedOrder.fulfillment_attempts >= 5 && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Maximum retries reached. Please contact support.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Pending Fulfillment — payment taken but pickup code not yet generated */}
                  {selectedOrder.status === "PENDING_FULFILLMENT" && (
                    <div className="flex flex-col items-center md:py-[40px] py-[24px] border-t border-orange-100 mt-4 px-4 bg-orange-50 rounded-b-2xl">
                      <div className="text-4xl mb-3">⚠️</div>
                      <p className="text-[16px] font-[700] text-orange-700 text-center mb-1">
                        Payment Confirmed — Pickup Code Pending
                      </p>
                      <p className="text-sm text-orange-600 text-center mb-5 max-w-sm">
                        Your payment was successful but we couldn't generate your pickup code automatically. You can retry below or contact support.
                      </p>
                      {retryError && (
                        <p className="text-sm text-red-600 font-semibold mb-3 text-center">{retryError}</p>
                      )}
                      <Button
                        onClick={() => handleRetryFulfillment(selectedOrder.id)}
                        disabled={retrying || selectedOrder.fulfillment_attempts >= 5}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-xl disabled:opacity-50">
                        {retrying ? "Retrying..." : "🔄 Retry Pickup Code"}
                      </Button>
                      {selectedOrder.fulfillment_attempts >= 5 && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Maximum retries reached. Please contact support.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Delivered — QR used, show delivery confirmation instead of QR */}
                  {(selectedOrder.qr_used || selectedOrder.status === "COMPLETED") && (
                    <div className="flex flex-col justify-center items-center md:py-[40px] py-[24px] border-t border-green-100 mt-4 px-4 bg-green-50 rounded-b-2xl">
                      <div className="text-5xl mb-3">✅</div>
                      <p className="text-[18px] font-[700] text-green-700 text-center mb-2">
                        Order Delivered!
                      </p>
                      <p className="text-sm text-green-600 text-center mb-4">
                        Your food has been collected. Enjoy your meal!
                      </p>
                      <div className="w-full max-w-xs bg-white rounded-xl border border-green-200 p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#83859C]">Order ID</span>
                          <span className="font-bold text-[#054A86]">#{selectedOrder.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#83859C]">Location</span>
                          <span className="font-semibold">{selectedOrder.location?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#83859C]">Total Paid</span>
                          <span className="font-bold">AED {parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#83859C]">Date</span>
                          <span className="font-semibold">{formatDate(selectedOrder.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active QR — pickup code ready, not yet used */}
                  {(selectedOrder.qr_code_url || selectedOrder.pickup_code) &&
                    !selectedOrder.qr_used &&
                    selectedOrder.status !== "COMPLETED" &&
                    selectedOrder.status !== "PENDING_FULFILLMENT" && (
                    <div className="flex flex-col justify-center items-center md:py-[40px] py-[24px] border-t border-gray-50 mt-4 px-4">
                      <p className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-center">
                        {currentStep === 2 ? "Woohoo! Your order is ready for pickup!" : "Your Pickup Details"}
                      </p>
                      <div className="mt-[24px] mb-[20px] rounded-[16px] border border-[#83859C] w-[180px] h-[180px] p-4 overflow-hidden flex items-center justify-center bg-white shadow-sm">
                        <img
                          src={selectedOrder.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedOrder.pickup_code}`}
                          alt="QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {selectedOrder.pickup_code && (
                        <div className="text-center mb-6">
                          <p className="text-sm text-[#83859C] font-semibold uppercase tracking-wider mb-1">Pickup Code</p>
                          <p className="text-[28px] font-bold text-[#054A86]">
                            {selectedOrder.pickup_code}
                          </p>
                        </div>
                      )}
                      <Button className="border w-[158px] border-[#545563] bg-transparent hover:bg-transparent text-[14px] leading-[16px] text-[#545563] font-bold">
                        Print QR
                      </Button>
                    </div>
                  )}
                  {/* Start ordered items render */}
                  <div className="pt-2 px-1">
                    {getGroupedItems(selectedOrder).map((group, groupIdx) => (
                      <div key={`group-${groupIdx}`} className="mb-6">
                        <h4 className="text-sm font-bold text-[#83859C] mb-3 uppercase tracking-wider pl-1">
                          {group.title}
                        </h4>
                        <div className="space-y-3">
                          {group.items.map((item, idx) => (
                            <OrderedItem key={`${item.id}-${idx}`} item={item} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* End ordered items render */}
                </div>
              </div>

              {/* RIGHT / BOTTOM: Summary - Location & Payment */}
              <aside className="space-y-6 lg:col-span-1 md:col-span-2 lg:block">
                <div className="rounded-2xl border border-[#EDEEF2] bg-white h-fit p-4">
                  <h1 className="text-[24px] leading-[32px] font-[700] text-[#2B2B43] ">
                    Pickup Location
                  </h1>
                  {/* map view */}
                  <div className="rounded-[12px] py-4 w-full max-h-[220px]">
                    <div className="flex-1 overflow-y-auto h-full space-y-4 pb-28">
                      <div className="w-full h-[220px] rounded-2xl overflow-hidden">
                        <VendingMap
                          readOnlyLocation={
                            selectedOrder.location?.position && selectedOrder.location
                              ? {
                                lat: selectedOrder.location.position.lat,
                                lng: selectedOrder.location.position.lng,
                                name: selectedOrder.location.name,
                                info: selectedOrder.location.info,
                              }
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {/* content */}
                  <div className="pt-6 ">
                    <h4 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-[#2B2B43]">
                      {selectedOrder.location?.name}
                    </h4>
                    <p className="text-[12px] leading-[16px] font-[600] tracking-[0.1px] text-[#83859C]">
                      Dubai , UAE
                    </p>
                    <p className="text-[14px] leading-[20px] font-[400] tracking-[0.2px] text-[#545563] pt-2">
                      {selectedOrder.location?.info}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#EDEEF2] bg-white h-fit p-4 mt-[24px]">
                  <h1 className="text-[24px] leading-[32px] font-[700] text-[#2B2B43] pb-4">
                    Payment Details
                  </h1>
                  {/* card detail */}
                  <div className="h-[88px] w-full border border-[#C7C8D2] bg-[#F6FBFF] rounded-[8px] p-[12px]">
                    <h3 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-neutral-black pb-[2px]">
                      **** **** **** 4629
                    </h3>
                    <p className="text-neutral-gray text-[12px] font-[400] leading-[16px] pb-2">
                      12/25
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-[14px] font-[400] leading-[20px] text-neutral-gray-dark">
                        Mohammad Esam
                      </p>
                      <img src={"/images/icons/visa.svg"} alt="card icon" />
                    </div>
                  </div>
                  {/* content */}
                  <div className="space-y-3 pt-6">
                    <div className="flex justify-between">
                      <span className="text-[#545563]">Subtotal</span>
                      <span className="font-medium">
                        AED {parseFloat(selectedOrder.total_amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#545563]">VAT</span>
                      <span className="font-medium">Included</span>
                    </div>

                    <div className="flex justify-between text-[#056AC1]">
                      <span>Discount (coupon)</span>
                      <span className="font-medium">- AED 0</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2">
                    <span className="text-[16px] leading-[24px] text-[#2B2B43] font-[400]">
                      Total <span className="">(VAT incl.)</span>
                    </span>
                    <span className="text-[#054A86]">
                      AED {parseFloat(selectedOrder.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <div className="max-md:hidden">
        <Footer />
      </div>
      <MobileFooterNav />
    </div>
  );
};

export default MyOrders;
