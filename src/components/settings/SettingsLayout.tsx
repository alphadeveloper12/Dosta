import { ReactNode, useState } from "react";
import { User, MapPin, CreditCard, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface NavItem {
 icon: typeof User;
 label: string;
 description: string;
 active?: boolean;
}

const navItems: NavItem[] = [
 {
  icon: User,
  label: "Account",
  description: "Personal information",
 },
 {
  icon: MapPin,
  label: "Address",
  description: "Shippings addresses",
 },
 {
  icon: CreditCard,
  label: "Payment method",
  description: "Connected credit cards",
 },
 {
  icon: Shield,
  label: "Security",
  description: "Password, 2FA",
 },
];

export default function SettingsLayout() {
 const paymentData = [
  {
   cardNum: "**** **** **** 4629",
   date: "12/25",
   name: "Mohammad Esam",
   img: "/images/icons/visa.svg",
  },
  {
   cardNum: "**** **** **** 9372",
   date: "10/28",
   name: "Mohammad Esam",
   img: "/images/icons/mastercard.svg",
  },
 ];
 const [tab, setTab] = useState(1);
 const renderContent = () => {
  switch (tab) {
   case 1:
    return (
     <div className="space-y-2">
      <h1 className="text-[20px] leading-[28px] font-[600] trackiing-[0.1px]  text-neutral-black">
       Account
      </h1>
      <div className="border border-[#EDEEF2] p-2 md:p-0 rounded-[16px]">
       {/* Personal Information Section */}
       <section className="bg-neutral-white rounded-[16px]  md:px-[16px] md:py-[24px] sm:p-8 shadow-sm ">
        <h2 className="text-lg font-semibold mb-6 text-foreground">
         Personal information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Full name
          </label>
          <input
           type="text"
           placeholder="Mohammad Esam"
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>

         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Company
          </label>
          <input
           type="text"
           placeholder=""
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>

         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Email
          </label>
          <input
           type="email"
           placeholder="mohammad.esam@example.com"
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>

         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Phone number
          </label>
          <input
           type="number"
           placeholder="(217) 555-0113"
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>
        </div>
       </section>

       {/* Email Notifications Section */}
       <section className="bg-neutral-white  p-6 sm:p-8 shadow-sm ">
        <h2 className="text-lg font-semibold mb-6 text-foreground">
         Email notifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         <div className="flex items-center space-x-3">
          <Checkbox id="newDeals" defaultChecked />
          <label
           htmlFor="newDeals"
           className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
           New deals
          </label>
         </div>

         <div className="flex items-center space-x-3">
          <Checkbox id="passwordChanges" defaultChecked />
          <label
           htmlFor="passwordChanges"
           className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
           Password changes
          </label>
         </div>

         <div className="flex items-center space-x-3">
          <Checkbox id="newRestaurants" defaultChecked />
          <label
           htmlFor="newRestaurants"
           className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
           New restaurants
          </label>
         </div>

         <div className="flex items-center space-x-3">
          <Checkbox id="specialOffers" defaultChecked />
          <label
           htmlFor="specialOffers"
           className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
           Special offers
          </label>
         </div>

         <div className="flex items-center space-x-3">
          <Checkbox id="orderStatuses" defaultChecked />
          <label
           htmlFor="orderStatuses"
           className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
           Order statuses
          </label>
         </div>

         <div className="flex items-center space-x-3">
          <Checkbox id="newsletter" defaultChecked />
          <label
           htmlFor="newsletter"
           className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
           Newsletter
          </label>
         </div>
        </div>
       </section>

       <div className="flex flex-col sm:flex-row gap-4 justify-between items-center py-5 px-4">
        <Button variant="destructive" className="w-full sm:w-auto">
         Log out
        </Button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
         <Button variant="outline" className="w-full sm:w-auto">
          Discard changes
         </Button>
         <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
          Save changes
         </Button>
        </div>
       </div>
      </div>
      {/* Action Buttons */}
     </div>
    );
   case 2: {
    return (
     <div className="space-y-2">
      <h1 className="text-[20px] leading-[28px] font-[600] tracking-[0.1px]  text-neutral-black">
       Address
      </h1>
      <div className="border border-[#EDEEF2] p-2 md:p-0  rounded-[16px]">
       <section className="bg-neutral-white rounded-[16px] py-2 md:px-[16px] md:py-[24px] sm:p-8 shadow-sm ">
        <h2 className="text-lg font-semibold mb-6 text-foreground">
         Existing address
        </h2>

        <div className="flex flex-wrap items-center md:flex-row gap-4">
         <div className="h-[106px] w-[222px] border border-[#C7C8D2] rounded-[8px] p-[12px]">
          <h3 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-neutral-black pb-[2px]">
           Home
          </h3>
          <p className="text-neutral-gray text-[12px] font-[400] leading-[16px] pb-2">
           Sharjah , UAE
          </p>
          <p className="text-[14px] font-[400] leading-[20px] text-neutral-gray-dark">
           1 Street 8A, Za'abeel 2
          </p>
         </div>
         <div className="h-[106px] w-[222px] border border-[#C7C8D2] rounded-[8px] p-[12px]">
          <h3 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-neutral-black pb-[2px]">
           Work
          </h3>
          <p className="text-neutral-gray text-[12px] font-[400] leading-[16px] pb-2">
           Dubai , UAE
          </p>
          <p className="text-[14px] font-[400] leading-[20px]  text-neutral-gray-dark">
           1 Street 8A, Za'abeel 2
          </p>
         </div>
        </div>
       </section>

       <section className="bg-neutral-white rounded-[16px] py-2  md:px-[16px] md:py-[24px] sm:p-8 shadow-sm ">
        <h2 className="text-lg font-semibold mb-6 text-foreground">
         New address
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Label
          </label>
          <input
           type="text"
           placeholder="Home, work, etc."
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>

         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Address Line 1
          </label>
          <input
           type="text"
           placeholder="Street name or number"
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>

         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Address Line 2
          </label>
          <input
           type="text"
           placeholder="Apartment, suite, etc."
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>

         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           city
          </label>
          <input
           type="number"
           placeholder="Enter city"
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>
         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Country
          </label>
          <select className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]">
           <option value="">Select Country</option>
           <option value="country1">Country 1</option>
           <option value="country2">Country 2</option>
          </select>
         </div>
         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Zone
          </label>
          <select className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]">
           <option value="">Select Zone</option>
           <option value="zone 1">Zone 1</option>
           <option value="zone 2">Zone 2</option>
          </select>
         </div>
        </div>
       </section>

       <div className=" gap-4  py-5 px-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-end sm:w-auto">
         <Button variant="outline" className="w-full sm:w-auto" disabled>
          Add new address
         </Button>
        </div>
       </div>
      </div>
      {/* Action Buttons */}
     </div>
    );
   }
   case 3: {
    return (
     <div className="space-y-2">
      <h1 className="text-[20px] leading-[28px] font-[600] tracking-[0.1px]  text-neutral-black">
       Payment method
      </h1>
      <div className="border border-[#EDEEF2] p-2 md:p-0  rounded-[16px]">
       <section className="bg-neutral-white rounded-[16px] py-2 md:px-[16px] md:py-[24px] sm:p-8 shadow-sm ">
        <h2 className="text-lg font-semibold mb-6 text-foreground">
         Connected payment methods
        </h2>

        <div className="flex flex-wrap items-center md:flex-row gap-4">
         {paymentData.map((card, index) => {
          return (
           <div className="h-[88px] w-[228px] border border-[#C7C8D2] rounded-[8px] p-[12px]">
            <h3 className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-neutral-black pb-[2px]">
             {card.cardNum}
            </h3>
            <p className="text-neutral-gray text-[12px] font-[400] leading-[16px] pb-2">
             {card.date}
            </p>
            <div className="flex justify-between items-center">
             <p className="text-[14px] font-[400] leading-[20px] text-neutral-gray-dark">
              {card.name}
             </p>
             <img src={card.img} alt="card icon" />
            </div>
           </div>
          );
         })}
        </div>
       </section>

       <section className="bg-neutral-white rounded-[16px] py-2 md:px-[16px] md:py-[24px] sm:p-8 shadow-sm ">
        <h2 className="text-lg font-semibold mb-6 text-foreground">
         New payment method
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="space-y-2 md:col-span-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Card number
          </label>
          <input
           type="number"
           placeholder="XXXX - XXXX - XXXX - XXXX"
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>

         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Expiration
          </label>
          <input
           type="text"
           placeholder="MM / YYYY"
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>

         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           CVC
          </label>
          <input
           type="text"
           placeholder="XXX"
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>

         <div className="space-y-2 md:col-span-4">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Cardholder
          </label>
          <input
           type="text"
           placeholder="Enter name on card"
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>
        </div>
       </section>

       <div className=" gap-4  py-5 px-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-end sm:w-auto">
         <Button variant="outline" className="w-full sm:w-auto" disabled>
          Add new payment method
         </Button>
        </div>
       </div>
      </div>
      {/* Action Buttons */}
     </div>
    );
   }
   case 4: {
    return (
     <div className="space-y-2">
      <h1 className="text-[20px] leading-[28px] font-[600] tracking-[0.1px]  text-neutral-black">
       Security
      </h1>
      <div className="border border-[#EDEEF2] p-2 md:p-0  rounded-[16px]">
       <section className="bg-neutral-white rounded-[16px] py-2  md:px-[16px] md:py-[24px] sm:p-8 shadow-sm ">
        <h2 className="text-lg font-semibold mb-6 text-foreground">
         2 factor authentication
        </h2>

        <div className="flex flex-col md:items-center md:flex-row md:justify-between gap-4">
         <div className="space-y-2 ">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Phone number
          </label>
          <input
           type="number"
           placeholder="(123) 456-7891"
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>
         <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 md:mt-[30px]">
          Turn on
         </Button>
        </div>
       </section>

       <section className="bg-neutral-white rounded-[16px] py-2 md:px-[16px] md:py-[24px] sm:p-8 shadow-sm ">
        <h2 className="text-lg font-semibold mb-6 text-foreground">
         Change password
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="space-y-2 ">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Current password
          </label>
          <input
           type="password"
           placeholder="Enter current password"
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>

         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           New password
          </label>
          <input
           type="number"
           placeholder="Enter new password"
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>

         <div className="space-y-2">
          <label
           htmlFor=""
           className="text-[0.75rem] text-neutral-gray-dark font-[600] leading-[1rem] mb-[0.5rem]">
           Confirm new password
          </label>
          <input
           type="number"
           placeholder="Confirm new password"
           className="w-full  py-[0.625rem] px-[0.75rem] outline-none border border-[#C7C8D2] rounded-[0.5rem] text-[0.875rem] sm:text-[1rem]"
          />
         </div>
        </div>
       </section>

       <div className=" gap-4  py-5 px-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-end sm:w-auto">
         <Button variant="outline" className="w-full sm:w-auto" disabled>
          Add new payment method
         </Button>
        </div>
       </div>
      </div>
      {/* Action Buttons */}
     </div>
    );
   }
  }
 };

 return (
  <div className="min-h-screen bg-neutral-white">
   {/* Header */}
   <header className="border-b border-border bg-card">
    <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
     <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
       <div className="w-5 h-5 border-2 border-primary-foreground rounded-sm" />
      </div>
      <span className="text-xl font-bold text-foreground">DOSTA</span>
     </div>

     <div className="flex items-center gap-4">
      <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
       EN
      </button>
      <button className="text-sm text-foreground hover:text-muted-foreground transition-colors hidden sm:inline">
       My Order
      </button>
      <button className="p-2 hover:bg-secondary rounded-md transition-colors">
       <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth={2}
         d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
       </svg>
      </button>
      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
       NS
      </div>
     </div>
    </div>
   </header>

   <div className="main-container  !py-6">
    <div className="flex flex-col lg:flex-row gap-6">
     {/* Sidebar */}
     <aside className="w-full lg:w-80">
      <h2 className="text-[20px] leading-[28px] font-[600] trackiing-[0.1px]  text-neutral-black pb-[8px]">
       Settings
      </h2>
      <nav className="space-y-2">
       {navItems.map((item, index) => {
        const Icon = item.icon;
        return (
         <button
          key={index}
          className={cn(
           "w-full flex items-center gap-4 p-4 rounded-[16px] transition-all text-left",
           tab === index + 1
            ? "bg-accent text-accent-foreground shadow-sm border-2 border-[#054A86]"
            : " border border-[#EDEEF2] "
          )}
          onClick={() => setTab(index + 1)}>
          <div
           className={cn(
            "w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0",
            tab === index + 1 ? "bg-[#054A86]" : "bg-[#EDEEF2]"
           )}>
           <Icon
            className={cn(
             "w-5 h-5",
             tab === index + 1 ? "text-neutral-white" : "text-muted-foreground"
            )}
           />
          </div>
          <div>
           <div className="font-semibold text-sm">{item.label}</div>
           <div
            className={cn(
             "text-xs",
             tab === index + 1
              ? "text-accent-foreground/70"
              : "text-muted-foreground"
            )}>
            {item.description}
           </div>
          </div>
         </button>
        );
       })}
      </nav>
     </aside>

     {/* Main Content */}
     <main className="flex-1">{renderContent()}</main>
    </div>
   </div>
  </div>
 );
}
