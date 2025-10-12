const HeroSection = () => {
 return (
  <section className="relative">
   {/* Background image */}
   <div
    className="h-[512px] bg-cover bg-center"
    style={{
     // If using Next.js/public folder, keep the leading slash:
     backgroundImage: "url('/images/vending_home/hero-vending.png')",
    }}
   />
   {/* Dark overlay */}
   <div className="absolute inset-0 h-[512px] bg-black/30" />

   {/* Content container with the white box */}
   <div className="absolute inset-0 h-[512px]">
    <div className="mx-auto h-full max-w-6xl px-4 flex items-center justify-center">
     <div className="w-full max-w-[585px] h-[440px] rounded-2xl bg-white shadow-[0_12px_24px_0_#2B2B4329] py-5 md:py-8 px-[20px] sm:px-[64px]">
      <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#054A86] text-center">
       Meals on Your Schedule
      </h1>
      <p className="mt-6 text-base font-semibold text-center text-[#545563]">
       Plan and reserve your meal and pick it up from a vending location nearby.
      </p>

      {/* Search input mock (replace with your component) */}
      <div className="mt-6 flex justify-center w-full sm:w-[80%] mx-auto">
       <input
        className="w-full max-w-md rounded-xl px-5 py-3 text-sm outline-none bg-[#EDEEF2] placeholder:text-[#545563]"
        placeholder="Find nearby vending locations…"
       />
       <svg
        className="-ml-8 mt-3"
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1_12308)">
         <path
          d="M14.5 6.66699C14.5 11.3337 8.5 15.3337 8.5 15.3337C8.5 15.3337 2.5 11.3337 2.5 6.66699C2.5 5.07569 3.13214 3.54957 4.25736 2.42435C5.38258 1.29913 6.9087 0.666992 8.5 0.666992C10.0913 0.666992 11.6174 1.29913 12.7426 2.42435C13.8679 3.54957 14.5 5.07569 14.5 6.66699Z"
          stroke="#2B2B43"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
         />
         <path
          d="M8.5 8.66699C9.60457 8.66699 10.5 7.77156 10.5 6.66699C10.5 5.56242 9.60457 4.66699 8.5 4.66699C7.39543 4.66699 6.5 5.56242 6.5 6.66699C6.5 7.77156 7.39543 8.66699 8.5 8.66699Z"
          stroke="#2B2B43"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
         />
        </g>
        <defs>
         <clipPath id="clip0_1_12308">
          <rect
           width="16"
           height="16"
           fill="white"
           transform="translate(0.5)"
          />
         </clipPath>
        </defs>
       </svg>
      </div>

      <div className="mt-6 text-center">
       <a href="#" className="text-sm text-[#056AC1] font-bold hover:underline">
        Or browse our vending meals
       </a>
      </div>
      <div className="mt-6 flex justify-center w-full">
      <img src="/images/vending_home/meal_browes.png" alt="Browes Meal" />
      </div>
     </div>
    </div>
   </div>
  </section>
 );
};

export default HeroSection;
