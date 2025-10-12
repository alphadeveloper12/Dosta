import React from "react";

const images = [
 { img: "/images/company/c1.svg", alt: "company logo" },
 { img: "/images/company/c2.svg", alt: "company logo" },
 { img: "/images/company/c3.svg", alt: "company logo" },
 { img: "/images/company/c4.svg", alt: "company logo" },
 { img: "/images/company/c5.svg", alt: "company logo" },
 { img: "/images/company/c6.svg", alt: "company logo" },
 { img: "/images/company/c7.svg", alt: "company logo" },
 { img: "/images/company/c8.svg", alt: "company logo" },
 { img: "/images/company/c9.svg", alt: "company logo" },
 { img: "/images/company/c10.svg", alt: "company logo" },
 { img: "/images/company/c11.svg", alt: "company logo" },
 { img: "/images/company/c12.svg", alt: "company logo" },
];

const Companies = () => {
 return (
  <section className="bg-[#F7F7F9] pt-[32px] pb-[64px]">
   <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[165px]">
    <h3 className="text-[28px] leading-[36px] tracking-[0.1px] font-[700] text-center text-[#054A86] pb-[8px]">
     Trusted by Leading Brands
    </h3>
    <p className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-neutral-gray text-center">
     We proudly serve top companies with tailored catering solutions.
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[30px] pt-[30px] justify-items-center">
     {images.map((image, index) => (
      <div
       key={index}
       className="h-[120px] w-[120px] sm:h-[140px] sm:w-[140px] lg:h-[160px] lg:w-[160px]">
       <img
        src={image.img}
        alt={image.alt}
        className="h-full w-full object-contain"
       />
      </div>
     ))}
    </div>
   </div>
  </section>
 );
};

export default Companies;
