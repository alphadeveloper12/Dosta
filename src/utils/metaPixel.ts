declare global {
 interface Window {
  fbq?: (...args: any[]) => void;
 }
}

const isFbqReady = () => typeof window !== "undefined" && typeof window.fbq === "function";

const toNumber = (value: unknown) => {
 const parsed = Number(value);
 return Number.isFinite(parsed) ? parsed : 0;
};

export const trackPurchase = (value: unknown, currency = "AED") => {
 if (!isFbqReady()) return;
 window.fbq!("track", "Purchase", {
  value: toNumber(value),
  currency,
 });
};

export const trackAddToCart = (value?: unknown, currency = "AED") => {
 if (!isFbqReady()) return;

 if (value === undefined) {
  window.fbq!("track", "AddToCart");
  return;
 }

 window.fbq!("track", "AddToCart", {
  value: toNumber(value),
  currency,
 });
};

export const trackViewContent = (contentName?: string, value?: unknown, currency = "AED") => {
 if (!isFbqReady()) return;

 const payload: Record<string, any> = {};
 if (contentName) payload.content_name = contentName;
 if (value !== undefined) payload.value = toNumber(value);
 if (value !== undefined) payload.currency = currency;

 if (Object.keys(payload).length > 0) {
  window.fbq!("track", "ViewContent", payload);
  return;
 }

 window.fbq!("track", "ViewContent");
};

export {};