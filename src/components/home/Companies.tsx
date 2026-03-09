import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

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
 const sectionRef = useRef(null);
 const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

 return (
  <section className="bg-[#F7F7F9] pt-[32px] pb-[64px]">
   <div className="main-container " ref={sectionRef}>
    <motion.h3
     className="text-[28px] leading-[36px] tracking-[0.1px] font-[700] text-center text-[#054A86] pb-[8px]"
     initial={{ opacity: 0, y: 25 }}
     animate={isInView ? { opacity: 1, y: 0 } : {}}
     transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
     Trusted by Leading Brands
    </motion.h3>
    <motion.p
     className="text-[16px] leading-[24px] font-[700] tracking-[0.1px] text-neutral-gray text-center"
     initial={{ opacity: 0, y: 20 }}
     animate={isInView ? { opacity: 1, y: 0 } : {}}
     transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
     We proudly serve top companies with tailored catering solutions.
    </motion.p>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[30px] pt-[30px] justify-items-center">
     {images.map((image, index) => (
      <motion.div
       key={index}
       className="h-[120px] w-[120px] sm:h-[140px] sm:w-[140px] lg:h-[160px] lg:w-[160px]"
       initial={{ opacity: 0, y: 30 }}
       animate={isInView ? { opacity: 1, y: 0 } : {}}
       transition={{
        duration: 0.4,
        delay: 0.15 + index * 0.05,
        ease: [0.22, 1, 0.36, 1],
       }}>
       <img
        src={image.img}
        alt={image.alt}
        className="h-full w-full object-contain"
       />
      </motion.div>
     ))}
    </div>
   </div>
  </section>
 );
};

export default Companies;
