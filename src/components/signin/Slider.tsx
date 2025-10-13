import { useEffect, useState } from "react";

const slides = [
  {
    img: "images/auth/slider-image.jpg",
    title: "Crafted Cuisine. Nourishing Intent.",
    subtitle: "We prepare elevated meals with health, care, and flavor.",
  },
  {
    img: "images/auth/slider-image.jpg",
    title: "Fresh Ingredients. Pure Delight.",
    subtitle: "Healthy, flavorful dishes crafted to perfection.",
  },
  {
    img: "images/auth/slider-image.jpg",
    title: "Taste the Wellness.",
    subtitle: "We bring nourishment with every bite.",
  },
];

const PromoSlider = () => {
  const [current, setCurrent] = useState(0);
  const autoplaySpeed = 3500;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, autoplaySpeed);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[55%] login-silder h-screen md:block hidden relative overflow-hidden">
      {/* Slides wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((s, idx) => (
          <div key={idx} className="w-full flex-shrink-0 relative h-screen">
            <img
              src={s.img}
              alt={s.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-xl mx-auto text-center px-6">
                <h3 className="text-white text-2xl md:text-3xl font-semibold">
                  {s.title}
                </h3>
                <p className="mt-5 text-white/90">{s.subtitle}</p>

                {/* Dots directly below subtitle */}
                <div className="flex justify-center gap-2 mt-[40px]">
                  {slides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCurrent(dotIdx)}
                      className={`w-3 h-3 rounded-full ${
                        dotIdx === current ? "bg-white" : "bg-white/50"
                      } transition-all duration-300`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoSlider;
