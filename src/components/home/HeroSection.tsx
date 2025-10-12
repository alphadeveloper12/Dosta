import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Slider from "react-slick"; // Importing React Slick

// Settings for the slider
const sliderSettings = {
  infinite: true, // Infinite loop
  slidesToShow: 1, // Show one slide at a time
  slidesToScroll: 1,
  autoplay: true, // Enable autoplay
  autoplaySpeed: 2000, // Change slide every 3 seconds
  dots: true, // Show pagination dots
  arrows: false, // Hide navigation arrows (optional)
  speed: 500, // Transition speed (ms)
};

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative lg:min-h-[623px] sm:min-h-[512px] flex items-start justify-center py-8 sm:py-0 bg-primary-dark">
      {/* React Slick Carousel */}
      <Slider {...sliderSettings} className="w-full max-w-[1440px] mx-auto">
        {/* Render the same card 4 times for now */}
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="relative z-10 w-full lg:mt-[52px] sm:mt-[36px] max-w-[1440px] mx-auto lg:px-[165px] px-4"
          >
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-[80px] px-[24px] sm:px-[48px] md:px-[64px] py-[24px] sm:py-[32px]">
              <div className="min-w-[0] sm:min-w-[490px]">
                <h1 className="text-[40px] sm:text-[40px] leading-[56px] font-[800] tracking-[0.1px] text-neutral-white pb-[16px]">
                  Innovation Meets Nutrition!
                </h1>
                <p className="text-[16px] leading-[24px] tracking-[0.1px] font-[700] text-neutral-white pb-[32px]">
                  We’re on a mission to transform how people experience healthy food,
                  with chef-designed meals, smart technology, and a touch of surprise.
                </p>
                <Button className="bg-[#FF5C60] py-[12px] px-[16px]">
                  Our Food Technology
                </Button>
              </div>

              <div className="min-w-[0] sm:min-w-[540px]">
                <img
                  src="/images/header/cheff.svg"
                  alt="chef image"
                  className="h-[361px] w-full sm:w-[540px] object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default HeroSection;