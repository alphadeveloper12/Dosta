const GetApp = () => {
 return (
  <section className="container max-w-[1110px] max-auto mb-[64px]">
   <div className="w-full">
    <div className="flex flex-wrap gap-4 md:gap-6">
     {/* Card */}
     <div className="bg-[#EE3123] rounded-2xl overflow-hidden shadow flex w-full md:w-[48%]">
      <div className="flex w-full flex-col sm:flex-row items-stretch">
       {/* Text */}
       <div className="flex-1 p-4 sm:p-6 flex flex-col gap-2 justify-start">
        <h3 className="text-white text-xl sm:text-2xl font-extrabold">
         Top Deals
        </h3>
        <p className="text-white text-sm sm:text-base font-semibold max-w-xs sm:max-w-sm leading-snug">
         Eat well. Pay less. Now with tasty savings!
        </p>
        <button
         type="button"
         className="bg-white text-[#545563] text-xs sm:text-sm font-extrabold py-2 px-4 rounded-full w-fit">
         Coming Soon!
        </button>
       </div>

       {/* Image: fills card height, touches top & bottom */}
       <div className="flex-1 sm:max-w-[45%] md:max-w-[40%] lg:max-w-[45%]">
        <img
         src="/images/vending_home/comingsoon_menu.png"
         alt="Coming Soon"
         loading="lazy"
         decoding="async"
         className="block w-full h-full object-cover"
        />
       </div>
      </div>
     </div>

     {/* Card (duplicate) */}
     <div className="bg-[#054A86] rounded-2xl overflow-hidden shadow flex w-full md:w-[48%]">
      <div className="flex w-full flex-col sm:flex-row items-stretch">
       <div className="flex-1 p-4 sm:p-6 flex flex-col gap-2 justify-start">
        <h3 className="text-white text-xl sm:text-2xl font-extrabold">
         Get the Dosta App
        </h3>
        <p className="text-white text-sm sm:text-base font-semibold max-w-xs sm:max-w-sm leading-snug">
         Manage your deliveries from anywhere, anytime.
        </p>
        <button
         type="button"
         className="bg-white text-[#545563] text-xs sm:text-sm font-extrabold py-2 px-4 rounded-full w-fit">
         Download App
        </button>
       </div>

       <div className="flex-1 sm:max-w-[45%] md:max-w-[40%] lg:max-w-[45%]">
        <img
         src="/images/vending_home/get-app.png"
         alt="Get App"
         loading="lazy"
         decoding="async"
         className="block w-full h-full object-cover"
        />
       </div>
      </div>
     </div>
    </div>
   </div>
  </section>
 );
};
export default GetApp;
