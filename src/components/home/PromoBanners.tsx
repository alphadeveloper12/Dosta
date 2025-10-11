import { Button } from "@/components/ui/button";

const PromoBanners = () => {
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

  return (
    <section className="bg-neutral-white pt-[120px] pb-[48px]">
      <div className="px-4">
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-[20px] md:gap-[30px]">
          {promoData.map((promo, index) => (
            <div
              key={index}
              className={`w-full max-w-[540px] md:h-[152px] md:w-[540px] rounded-xl overflow-hidden shadow-lg md:min-h-[180px]`}
              style={{ backgroundColor: promo.bgColor }}>
              <div className="flex items-center h-full">
                <div className="flex-1 p-4 md:p-6 md:w-[316px] md:py-[17px] md:pl-[32px]">
                  <h3 className="text-lg md:text-xl font-bold text-destructive-foreground mb-1">
                    {promo.title}
                  </h3>
                  <p className="text-destructive-foreground/90 text-sm mb-3 md:mb-4">
                    {promo.description}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-neutral-white text-neutral-black hover:bg-neutral-white/90 font-semibold !h-[30px] rounded-[16px]">
                    {promo.buttonText}
                  </Button>
                </div>
                <div className="w-[120px] md:w-[244px] h-full flex items-center flex-shrink-0">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover rounded-l-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;