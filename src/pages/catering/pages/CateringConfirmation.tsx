import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/layout/Header";
import Footer from "@/components/layout/Footer";
import locationimg from "@/assets/../../public/images/icons/locaion-icon.svg";
import calendar from "@/assets/../../public/images/icons/calendar.svg";
import { Button } from "@/components/ui/button"; // Import the Button component

function Row({ label, value }) {
 return (
  <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-3 sm:gap-4 border-none">
   <div className="text-xl font-medium text-[#545563]">{label}</div>
   <div className="sm:col-span-2 text-base font-bold text-[#056AC1]">
    {value}
   </div>
  </div>
 );
}

function ItemLink({ children }) {
 return (
  <div className="cursor-default font-bold text-[#056AC1] hover:underline">
   {children}
  </div>
 );
}
const CateringConfirmation = () => {
 const navigate = useNavigate();
 return (
  <div className="min-h-screen flex flex-col">
   <Header />

   <main className="flex-1 bg-background">
    <div className="bg-neutral-white">
     <div className="container py-6">
      <div className="flex items-center gap-2 text-sm mb-6">
       <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-neutral-gray-dark hover:text-primary transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Breadcrumbs
       </button>
       <span className="text-neutral-gray">/</span>
       <span className="text-neutral-gray-dark">Breadcrumbs</span>
      </div>

      <h1 className="md:text-4xl font-bold text-primary text-[28px]">
       Catering Service Confirmation
      </h1>
     </div>
    </div>

    <div className="container mx-auto px-12 py-6 pb-24">
     <div className="grid gap-4 md:grid-cols-[1fr_320px]">
      {/* LEFT: Booking Card + Details */}
      <div className="space-y-4">
       {/* Booking Header Card */}
       <div className="rounded-2xl border border-[#EDEEF2] bg-white">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-4">
         <div className="flex w-full flex-col gap-1">
          <div className="flex items-center justify-between gap-3 w-full">
           <p className="text-[24px] font-bold leading-8 text-#2B2B43">
            ID 67352427
           </p>
           <div className="flex gap-2 items-center">
            <p className="text-xs font-semibold leading-[16px] text-[#83859C]">
             Location at Barsha 1, near Mall of the Emirates
            </p>
            <img
             src={locationimg}
             alt="location Icon"
             className="w-[16px] h-[16px]"
            />
           </div>
          </div>
          <div className="flex items-center justify-between gap-3 w-full">
           <div className="mt-1 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#054A86]" />
            <span className="text-sm font-semibold leading-5">In progress</span>
           </div>
           <div className="flex gap-2 items-center">
            <p className="text-xs font-semibold leading-[16px] text-[#83859C]">
             06 November 2025, 08:00 PM
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

        {/* Progress */}
        <div className="px-4 pt-3">
         <div className="flex justify-between w-ful gap-2 items-center">
          <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#1ABF70] text-white ring-[#1ABF70]">
           <svg
            width="120"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
             d="M16.6673 5.83398L7.50065 15.0007L3.33398 10.834"
             stroke="white"
             stroke-width="2"
             stroke-linecap="round"
             stroke-linejoin="round"
            />
           </svg>
          </span>
          <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-gray-100">
           <div
            className="absolute left-0 top-0 h-full w-2/3 rounded-full bg-emerald-500"
            aria-hidden
           />
          </div>
          <span className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white text-[#2B2B43] ring-1 ring-[#EDEEF2]">
           3
          </span>
         </div>
         <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
           <span className="text-base font-bold text-[#2B2B43]">
            Confirmed Booking
           </span>
          </div>
          <span className="ext-base font-bold text-[#2B2B43]">Served</span>
         </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-4">
         <button className="inline-flex items-center justify-center rounded-lg border border-[#545563] bg-white px-3 py-3 leading-[17px] text-sm font-bold text-[#545563] hover:bg-gray-50" >
          Cancel Booking
         </button>
         <Button onClick={() => navigate("/catering/request-custom-quote") }variant="default" size="lg" >
          Reschedule Booking
         </Button>
        </div>

        {/* Info note */}
        <div className="p-4 text-xsm font-normal leading-5 text-[#2B2B43">
         You can reschedule your booking before 23 September 2025, 09:50 am
        </div>
       </div>

       {/* Booking Details */}
       <div className="rounded-2xl border border-[#EDEEF2] bg-white pb-3">
        <div className="p-4">
         <h2 className="text-[24px] font-bold leading-8 text-#2B2B43">
          Booking details
         </h2>
        </div>

        <div className="divide-y pl-2">
         <Row
          label="Event Type"
          value={
           <div className="space-y-1">
            <ItemLink>Corporate Event</ItemLink>
            <ItemLink>20 Guests</ItemLink>
            <ItemLink>06 November 2025, 08:00 PM</ItemLink>
           </div>
          }
         />
         <Row
          label="Provider Type"
          value={
           <div className="space-y-1">
            <ItemLink>Caterers</ItemLink>
            <ItemLink>Boxed Meal, Plated Meal</ItemLink>
           </div>
          }
         />
         <Row
          label="Cuisines"
          value={<ItemLink>American, Italian, Mediterranean</ItemLink>}
         />
         <Row
          label="Courses"
          value={<ItemLink>Canapes, Coffee/Tea</ItemLink>}
         />
         <Row label="Location" value={<ItemLink>Ajman</ItemLink>} />
         <Row
          label="Budget"
          value={<ItemLink>Basic AED70 per guest</ItemLink>}
         />
        </div>
       </div>
      </div>

      {/* RIGHT: Summary */}
      <aside className="rounded-2xl border border-[#EDEEF2] bg-white h-fit p-4" >
       <div >
        <h3 className="text-[28PX] Font-bold leading-9 text-[#2B2B43]">
         Booking Summary
        </h3>
       </div>

       <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
         <span className="text-sm fot-noraml leading-5 text[#545563]">Guest ×20</span>
         <span className="text-sm font-semibold text-[#2B2B43]">AED1400.00</span>
        </div>
        <div className="flex items-center justify-between">
         <span className="text-sm fot-noraml leading-5 text[#545563]">VAT</span>
         <span className="text-sm font-semibold text-[#2B2B43]">AED150.00</span>
        </div>
        <div className="flex items-center justify-between">
         <span className="text-fot-noraml leading-5 text[#545563]">Total (VAT incl.)</span>
         <span className="text-base font-bold text-[#054A86]">AED1550.50</span>
        </div>
       </div>
      </aside>
     </div>
    </div>
   </main>

   <Footer />
  </div>
 );
};

export default CateringConfirmation;
