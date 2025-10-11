import { Button } from "@/components/ui/button";

const steps = [
 {
  icon: "images/header/card1.svg", // Replace with your actual image path
  title: "25 Restaurants, One Easy Order",
  description:
   "Freshly prepared dishes delivered straight to your home or workspace",
  tag: "DOSTA DELIVERY",
  button: "Browse Menus",
 },
 {
  icon: "images/header/card2.svg", // Replace with your actual image path
  title: "Meals on Your Schedule",
  description:
   "Plan your week with nutritious meals placed in vending stations near you",
  tag: "DOSTA VENDING",
  button: "Start Planning",
 },
 {
  icon: "images/header/card3.svg", // Replace with your actual image path
  title: "Wellness Meets Convenience",
  description:
   "Balanced meal plans tailored for your health goals, delivered or picked up.",
  tag: "DOSTA WELLNESS",
  button: "Explore Plans",
 },
 {
  icon: "images/header/card4.svg", // Replace with your actual image path
  title: "Flavorful Catering for Any Event",
  description:
   "From private gatherings to grand celebrations, we craft unforgettable meals",
  tag: "DOSTA CATERING",
  button: "Book Your Event",
 },
 {
  icon: "images/header/card5.svg", // Replace with your actual image path
  title: "Fuel Your Team, Elevate Productivity",
  description:
   "Office catering that's both delicious and professionally executed",
  tag: "DOSTA CORPORATE",
  button: "Order for Your Team",
 },
 {
  icon: "images/header/card6.svg", // Replace with your actual image path
  title: "Food with Heart and Purpose",
  description:
   "Partner with us to support food drives, community events, and local causes.",
  tag: "DOSTA GIVING",
  button: "Support the Mission",
 },
];

const ShowCase = () => {
 return (
  <section className="pb-[24px] pt-[48px]  relative md:h-[844px] bg-[#F7F7F9] ">
   <div className="container mx-auto px-4">
    {/* Steps */}
    <div className=" md:absolute -top-[92px] flex flex-wrap justify-center items-center gap-6 my-[24px]">
     {steps.map((step, index) => {
      return (
       <div
        key={index}
        className="relative w-full max-w-[350px] h-[478px] shadow-xl bg-neutral-white rounded-[16px]">
        <img
         src={step.icon}
         alt="logo"
         className="h-[224px] w-[350px] relative"
        />
        <span className="text-primary-dark absolute top-[208px] left-6 z-10 text-[11px] leading-4 font-[700] tracking-[0.6px] rounded-[16px] bg-[#A7CF38] py-2 px-4">
         {step.tag}
        </span>
        <div className="pt-[32px] px-[24px] pb-[24px]">
         <h3 className="text-[28px] leading-[36px] tracking-[0.1px] font-[700] text-primary mb-2">
          {step.title}
         </h3>
         <p className="text-neutral-gray-dark text-sm leading-relaxed pb-[24px]">
          {step.description}
         </p>
         <button className="py-3 px-4 border text-[14px] text-primary-dark leading-[20px] tracking-[0.3px] border-[#054A86] rounded-[8px]">
          {step.button}
         </button>
        </div>
       </div>
      );
     })}
    </div>
   </div>
  </section>
 );
};

export default ShowCase;
