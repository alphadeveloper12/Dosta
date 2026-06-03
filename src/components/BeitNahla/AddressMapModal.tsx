import React, {
 useState,
 useEffect,
 useRef,
 useCallback,
 useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Loader2, Locate, Clock } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Leaflet ships with default marker icons that use relative URLs which
// break under Vite. Repoint them to a CDN so the pin always renders.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
 iconRetinaUrl:
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
 iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
 shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface DeliveryResult {
 distance_km: number;
 deliverable: boolean;
 service_charge: number;
 delivery_charge: number;
 total_extra: number;
 tier_label: string | null;
 used_road_distance: boolean;
 max_deliverable_km: number;
 is_open_now?: boolean;
 current_time?: string;
 opening_time?: string;
 closing_time?: string;
 message?: string;
}

export interface AddressData {
 name: string;
 phone: string;
 building: string;
 street: string;
 appt: string;
 latitude: number;
 longitude: number;
 address: string;
 delivery: DeliveryResult;
 }

interface AddressMapModalProps {
 open: boolean;
 onClose: () => void;
 onSubmit: (data: AddressData) => void;
 defaultLat?: number;
 defaultLng?: number;
 openingTime?: string;
 closingTime?: string;
}

const formatTime = (hhmm?: string) => {
 if (!hhmm) return "";
 const [h, m] = hhmm.split(":").map(Number);
 if (isNaN(h)) return hhmm;
 const period = h >= 12 ? "PM" : "AM";
 const h12 = h % 12 === 0 ? 12 : h % 12;
 return `${h12}:${(m || 0).toString().padStart(2, "0")} ${period}`;
};

// Internal helper: handles click-to-set-pin on the Leaflet map.
const MapClickHandler: React.FC<{
 onPick: (lat: number, lng: number) => void;
}> = ({ onPick }) => {
 useMapEvents({
  click(e) {
   onPick(e.latlng.lat, e.latlng.lng);
  },
 });
 return null;
};

// Internal helper: pans/zooms the map to the current marker every time it
// changes. Mirrors what we did for Google Maps; here Leaflet's `useMap`
// gives us the live map instance.
const RecenterMap: React.FC<{
 lat: number | null;
 lng: number | null;
 zoom: number;
}> = ({ lat, lng, zoom }) => {
 const map = useMap();
 useEffect(() => {
  if (lat == null || lng == null) return;
  map.flyTo([lat, lng], zoom, { duration: 0.6 });
 }, [lat, lng, zoom, map]);
 return null;
};

const AddressMapModal: React.FC<AddressMapModalProps> = ({
 open,
 onClose,
 onSubmit,
 defaultLat = 25.2048,
 defaultLng = 55.2708,
 openingTime,
 closingTime,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [building, setBuilding] = useState("");
  const [street, setStreet] = useState("");
  const [appt, setAppt] = useState("");
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
   null,
  );
  const [address, setAddress] = useState("");
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<DeliveryResult | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const reverseDebounceRef = useRef<number | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL || "";

  // Reset modal state whenever it opens.
  useEffect(() => {
   if (open) {
    setName("");
    setBuilding("");
    setStreet("");
    setAppt("");
    setMarker(null);
    setAddress("");
    setDelivery(null);
    setCalcError(null);
    setLocateError(null);
    setLocating(false);
   }
  }, [open]);

 // Reverse geocode (pin -> address) via Nominatim. Free, no API key.
 const reverseGeocode = useCallback((lat: number, lng: number) => {
  if (reverseDebounceRef.current)
   window.clearTimeout(reverseDebounceRef.current);

  // Tentative coord fallback so the field is never blank while we look up.
  setAddress(`Pin location: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);

  reverseDebounceRef.current = window.setTimeout(async () => {
   try {
    const res = await axios.get(
     "https://nominatim.openstreetmap.org/reverse",
     {
      // Custom headers (Accept-Language, User-Agent) trigger a CORS
      // preflight Nominatim doesn't answer — keep this a "simple"
      // request and pass language as a query param.
      params: {
       lat,
       lon: lng,
       format: "json",
       zoom: 18,
       addressdetails: 1,
       "accept-language": "en",
      },
     },
    );
    if (res.data && res.data.display_name) {
     setAddress(res.data.display_name);
    }
   } catch {
    // Keep the coord fallback.
   }
  }, 300);
 }, []);

 // Recalculate delivery (and reverse-geocode address) whenever the marker
 // moves.
 useEffect(() => {
  if (!open || !marker) return;
  let cancelled = false;
  const run = async () => {
   setCalculating(true);
   setCalcError(null);
   setDelivery(null);
   try {
    const res = await axios.post(
     `${baseUrl}/api/catering/beit-nahla/calculate-delivery/`,
     {
      user_latitude: marker.lat,
      user_longitude: marker.lng,
     },
    );
    if (!cancelled) setDelivery(res.data);
   } catch {
    if (!cancelled) setCalcError("Could not calculate distance. Try again.");
   } finally {
    if (!cancelled) setCalculating(false);
   }
  };
  run();
  reverseGeocode(marker.lat, marker.lng);
  return () => {
   cancelled = true;
  };
 }, [marker, baseUrl, open, reverseGeocode]);

 const handleGetLocation = () => {
  if (!navigator.geolocation) {
   setLocateError("Your browser doesn't support geolocation.");
   return;
  }

  setLocateError(null);
  setLocating(true);

  // Track whether this attempt has already resolved. Some browsers fire the
  // error callback first (e.g. transient "denied" while the permission prompt
  // is still visible) and then fire success when the user finally grants —
  // we ignore late errors and only surface the final outcome.
  let settled = false;

  navigator.geolocation.getCurrentPosition(
   (pos) => {
    settled = true;
    setMarker({
     lat: pos.coords.latitude,
     lng: pos.coords.longitude,
    });
    setLocateError(null);
    setLocating(false);
   },
   (err) => {
    if (settled) return;
    settled = true;
    setLocating(false);
    // Permission state at the moment of failure — only show the "blocked"
    // message if the browser actually reports denied. A bare code-1 with no
    // confirmed-denied state is usually a transient prompt glitch.
    if (err.code === 1 && navigator.permissions?.query) {
     navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((p) => {
       if (p.state === "denied") {
        setLocateError(
         "Location is blocked for this site. Click the lock icon in the address bar, allow Location, then try again. Or drop a pin on the map.",
        );
       }
      })
      .catch(() => {});
     return;
    }
    if (err.code === 2) {
     setLocateError(
      "Your device couldn't determine your location. Drop a pin on the map instead.",
     );
     return;
    }
    if (err.code === 3) {
     setLocateError(
      "Location took too long to respond. Try again or drop a pin on the map.",
     );
     return;
    }
    setLocateError("Couldn't get your location. Drop a pin on the map instead.");
   },
   { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
  );
 };

  const phoneValid = phone.startsWith("05") && phone.length === 10;
  const isOpenNow = delivery?.is_open_now !== false;
  const customAddressValid =
   name.trim().length > 0 &&
   building.trim().length > 0 &&
   street.trim().length > 0 &&
   appt.trim().length > 0;
  const canSubmit =
   phoneValid &&
   customAddressValid &&
   marker !== null &&
   !calculating &&
   delivery !== null &&
   delivery.deliverable &&
   isOpenNow &&
   address.trim().length > 3;

  const effectiveOpening = delivery?.opening_time || openingTime;
  const effectiveClosing = delivery?.closing_time || closingTime;

  const handleSubmit = () => {
   if (!canSubmit || !delivery || !marker) return;
   onSubmit({
    name: name.trim(),
    phone,
    building: building.trim(),
    street: street.trim(),
    appt: appt.trim(),
    latitude: marker.lat,
    longitude: marker.lng,
    address: address.trim(),
    delivery,
   });
 };

 // Initial map center (only used on map mount; afterwards RecenterMap pans).
 const initialCenter = useMemo<[number, number]>(
  () => [defaultLat, defaultLng],
  [defaultLat, defaultLng],
 );

 return (
  <AnimatePresence>
   {open && (
    <motion.div
     className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4"
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     onClick={onClose}>
     <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={(e) => e.stopPropagation()}
      data-lenis-prevent="true"
      className="bg-white w-full max-w-[640px] max-h-[95vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-3 flex items-center justify-between border-b border-gray-100">
       <div>
        <h2 className="text-[20px] md:text-[22px] font-[700] text-[#2B2B43]">
         Delivery Details
        </h2>
        <p className="text-[#83859C] text-[13px]">
         Use your current location, then fine-tune by dragging the pin.
        </p>
       </div>
       <button
        onClick={onClose}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <X className="w-5 h-5 text-gray-500" />
       </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
       {/* Working hours banner */}
       {(effectiveOpening || effectiveClosing) && (
        <div
         className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
          isOpenNow
           ? "border-emerald-200 bg-emerald-50"
           : "border-red-200 bg-red-50"
         }`}>
         <Clock
          className={`w-5 h-5 flex-shrink-0 ${
           isOpenNow ? "text-emerald-600" : "text-red-500"
          }`}
         />
         <div className="flex-1 min-w-0">
          <p
           className={`text-[13px] font-bold ${
            isOpenNow ? "text-emerald-700" : "text-red-700"
           }`}>
           {isOpenNow ? "Open now" : "Currently closed"}
          </p>
          <p className="text-[11px] text-[#545563]">
           Working hours: {formatTime(effectiveOpening)} – {formatTime(effectiveClosing)}
           {delivery?.current_time && (
            <span className="text-[#83859C]">
             {" "}
              · now {formatTime(delivery.current_time)}
            </span>
           )}
          </p>
         </div>
        </div>
       )}

        {/* Full Name */}
        <div>
         <label className="block text-sm font-bold text-[#2B2B43] mb-2">
          Full Name
         </label>
         <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-12 px-4 rounded-xl border border-[#EDEEF2] focus:border-[#054A86] focus:ring-1 focus:ring-[#054A86] outline-none transition-all text-[#2B2B43]"
         />
        </div>

       {/* Phone */}
       <div>
        <label className="block text-sm font-bold text-[#2B2B43] mb-2">
         Phone Number
        </label>
        <input
         type="tel"
         placeholder="05X XXX XXXX"
         maxLength={10}
         value={phone}
         onChange={(e) => {
          const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
          setPhone(val);
         }}
         className={`w-full h-12 px-4 rounded-xl border outline-none transition-all text-[#2B2B43] ${
          phone.length > 0 &&
          (phone.length < 10 || !phone.startsWith("05"))
           ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400"
           : "border-[#EDEEF2] focus:border-[#054A86] focus:ring-1 focus:ring-[#054A86]"
         }`}
        />
        {phone.length > 0 && !phone.startsWith("05") && (
         <p className="text-red-500 text-xs mt-1">
          Number must start with 05
         </p>
        )}
       </div>

       {/* Get current location */}
       <div>
        <button
         type="button"
         onClick={handleGetLocation}
         disabled={locating}
         className={`w-full flex items-center justify-center gap-2 h-12 rounded-xl font-bold transition-all ${
          locating
           ? "bg-[#EDEEF2] text-[#83859C] cursor-not-allowed"
           : "bg-[#054A86] text-white hover:bg-[#054A86]/90 shadow-md shadow-[#054A86]/20 active:scale-[0.99]"
         }`}>
         {locating ? (
          <>
           <Loader2 className="w-5 h-5 animate-spin" /> Getting your location...
          </>
         ) : (
          <>
           <Locate className="w-5 h-5" /> Get my current location
          </>
         )}
        </button>
        {locateError && (
         <p className="text-red-500 text-xs mt-2">{locateError}</p>
        )}
        <p className="text-[11px] text-[#83859C] mt-2">
         Once placed, drag the pin to fine-tune the exact delivery spot.
        </p>
       </div>

       {/* Map (Leaflet + OpenStreetMap — no API key needed) */}
       <div className="relative z-0 rounded-xl overflow-hidden border border-[#EDEEF2]">
        <MapContainer
         center={initialCenter}
         zoom={12}
         scrollWheelZoom
         style={{ width: "100%", height: "300px" }}>
         <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
          maxZoom={20}
         />
         <MapClickHandler
          onPick={(lat, lng) => {
           setMarker({ lat, lng });
           setLocateError(null);
          }}
         />
         <RecenterMap
          lat={marker?.lat ?? null}
          lng={marker?.lng ?? null}
          zoom={16}
         />
         {marker && (
          <Marker
           position={[marker.lat, marker.lng]}
           draggable
           eventHandlers={{
            dragend: (e) => {
             const m = e.target as L.Marker;
             const p = m.getLatLng();
             setMarker({ lat: p.lat, lng: p.lng });
            },
           }}
          />
         )}
        </MapContainer>
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[11px] text-[#054A86] font-bold flex items-center gap-1 shadow-sm pointer-events-none z-[400]">
         <MapPin className="w-3 h-3" />{" "}
         {marker ? "Drag the pin to adjust" : "Tap the map or use current location"}
        </div>
       </div>

       {/* Address (read-only) */}
       <div>
        <label className="block text-sm font-bold text-[#2B2B43] mb-2">
         Delivery Address
        </label>
        <textarea
         rows={2}
         value={address}
         readOnly
         placeholder="Tap a location on the map or 'Get my current location' to set your address."
         className="w-full px-4 py-3 rounded-xl border border-[#EDEEF2] bg-[#F7F7F9] text-[#2B2B43] resize-none cursor-default focus:outline-none focus:ring-0"
        />
        <p className="text-[11px] text-[#83859C] mt-1">
         Filled automatically from your pin. Move the pin to change.
        </p>
        </div>

        {/* Custom Address Fields (same layout as Dosta Sweets) */}
        <div className="grid grid-cols-2 gap-4">
         <div className="col-span-2">
          <label className="block text-sm font-bold text-[#2B2B43] mb-2">
           Building
          </label>
          <input
           type="text"
           placeholder="Building Name/Number"
           value={building}
           onChange={(e) => setBuilding(e.target.value)}
           className="w-full h-12 px-4 rounded-xl border border-[#EDEEF2] focus:border-[#054A86] focus:ring-1 focus:ring-[#054A86] outline-none transition-all text-[#2B2B43]"
          />
         </div>
         <div>
          <label className="block text-sm font-bold text-[#2B2B43] mb-2">
           Street
          </label>
          <input
           type="text"
           placeholder="Street Name"
           value={street}
           onChange={(e) => setStreet(e.target.value)}
           className="w-full h-12 px-4 rounded-xl border border-[#EDEEF2] focus:border-[#054A86] focus:ring-1 focus:ring-[#054A86] outline-none transition-all text-[#2B2B43]"
          />
         </div>
         <div>
          <label className="block text-sm font-bold text-[#2B2B43] mb-2">
           Appt
          </label>
          <input
           type="text"
           placeholder="Appt Number"
           value={appt}
           onChange={(e) => setAppt(e.target.value)}
           className="w-full h-12 px-4 rounded-xl border border-[#EDEEF2] focus:border-[#054A86] focus:ring-1 focus:ring-[#054A86] outline-none transition-all text-[#2B2B43]"
          />
         </div>
        </div>

        {/* Distance result */}
       <div className="rounded-xl border border-[#EDEEF2] bg-[#FAFAFD] p-4">
        {!marker ? (
         <p className="text-[#83859C] text-sm">
          Set a location to estimate delivery charges.
         </p>
        ) : calculating ? (
         <div className="flex items-center gap-3 text-[#054A86]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <div>
           <p className="text-sm font-bold">Calculating distance...</p>
           <p className="text-[11px] text-[#83859C]">
            Estimating from Dosta to your pin. This is fast — hold on.
           </p>
          </div>
         </div>
        ) : calcError ? (
         <p className="text-red-500 text-sm">{calcError}</p>
        ) : delivery ? (
         delivery.deliverable ? (
          <div className="space-y-1.5">
           <div className="flex justify-between text-sm">
            <span className="text-[#545563]">Distance</span>
            <span className="font-bold text-[#2B2B43]">
             {delivery.distance_km} km
             {!delivery.used_road_distance && (
              <span className="text-[10px] text-[#83859C] ml-1">
               (approx)
              </span>
             )}
            </span>
           </div>
           <div className="flex justify-between text-sm">
            <span className="text-[#545563]">Service charge</span>
            <span className="font-medium text-[#2B2B43]">
             AED {delivery.service_charge.toFixed(2)}
            </span>
           </div>
           <div className="flex justify-between text-sm">
            <span className="text-[#545563]">Delivery charge</span>
            <span className="font-medium text-[#2B2B43]">
             AED {delivery.delivery_charge.toFixed(2)}
            </span>
           </div>
           <div className="flex justify-between text-sm pt-1.5 border-t border-gray-100 mt-1">
            <span className="text-[#545563] font-bold">Total extra</span>
            <span className="font-bold text-[#054A86]">
             AED {delivery.total_extra.toFixed(2)}
            </span>
           </div>
          </div>
         ) : (
          <div className="text-red-600 text-sm font-bold">
           {delivery.message ||
            `Sorry, we do not deliver beyond ${delivery.max_deliverable_km} km. Your pin is ${delivery.distance_km} km away.`}
          </div>
         )
        ) : null}
       </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3">
       <button
        onClick={onClose}
        className="w-full sm:w-1/3 border-2 border-[#EBEBEB] text-[#545563] hover:border-[#054A86] hover:text-[#054A86] rounded-xl py-3 font-bold transition-colors">
        Cancel
       </button>
       <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full sm:flex-1 rounded-xl py-3 font-bold shadow-lg transition-all active:scale-95 ${
         canSubmit
          ? "bg-[#054A86] text-white hover:bg-[#054A86]/90 shadow-[#054A86]/20"
          : "bg-[#C7C8D2] text-white cursor-not-allowed shadow-none"
        }`}>
        {!isOpenNow
         ? "Closed — can't order now"
         : delivery && !delivery.deliverable
         ? "Out of delivery range"
         : !marker
         ? "Set a location first"
         : "Continue to Cart"}
       </button>
      </div>
     </motion.div>
    </motion.div>
   )}
  </AnimatePresence>
 );
};

export default AddressMapModal;
