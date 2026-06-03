import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const PromoBanners = ({ onDownloadClick }: { onDownloadClick?: () => void }) => {
 const promoData = [
  {
   title: "Top Deals",
   description: "Eat well. Pay less. Now with tasty savings!",
   buttonText: "Coming Soon",
   image: "/images/icons/promoburger.svg",
   bgColor: "#EE3123",
  },
  {
   title: "Get the Dosta App",
   description: "Manage your deliveries from anywhere, anytime.",
   buttonText: "Download App",
   image: "/images/icons/promomobile.svg",
   bgColor: "#054A86",
  },
 ];

 const sectionRef = useRef(null);
 const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

 return (
  <section className="bg-neutral-white lg:pt-[120px] pt-[24px] pb-[48px] overflow-hidden">
   <div className="main-container" ref={sectionRef}>
    <div className="w-full flex flex-col md:flex-row justify-center items-center md:items-stretch gap-[20px] md:gap-[30px]">
     {promoData.map((promo, index) => (
      <motion.div
       key={index}
       initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
       animate={isInView ? { opacity: 1, x: 0 } : {}}
       transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
       }}
       className={`w-full max-w-[540px] lg:min-h-[180px] md:h-auto flex items-center md:w-[540px] rounded-xl overflow-hidden shadow-lg md:min-h-[180px]`}
       style={{ backgroundColor: promo.bgColor }}>
       <div className="flex items-center h-full ">
        <div className="flex-1 p-4  md:w-[50%] md:pt-[17px] md:pl-[32px]">
         <h3 className="text-lg md:text-[24px] md:leading-[32px] md:font-[800] font-bold text-neutral-white mb-1">
          {promo.title}
         </h3>
         <p className="text-destructive-foreground/90 text-sm md:text-[16px] leading-[24px] tracking-[0.1px] font-[700] mb-3 md:mb-4">
          {promo.description}
         </p>
         {promo.buttonText === "Download App" ? (
          <Button
           variant="secondary"
           size="sm"
           onClick={onDownloadClick}
           className="bg-neutral-white text-neutral-gray-dark hover:bg-neutral-white/90 text-[12px] leading-[18px] tracking-[0.6px] font-[800] !h-[30px] rounded-[16px] cursor-pointer">
           {promo.buttonText}
          </Button>
         ) : (
          <Button
           variant="secondary"
           size="sm"
           className="bg-neutral-white text-neutral-gray-dark hover:bg-neutral-white/90 text-[12px] leading-[18px] tracking-[0.6px] font-[800] !h-[30px] rounded-[16px]">
           {promo.buttonText}
          </Button>
         )}
        </div>
        <div className="w-[120px] md:w-[50%] h-full flex items-center flex-shrink-0">
         <img
          src={promo.image}
          alt={promo.title}
          className="w-full h-full object-fit rounded-l-lg"
         />
        </div>
       </div>
      </motion.div>
     ))}
    </div>
   </div>
  </section>
 );
};

export default PromoBanners;
