import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// ---------- Slider config ----------
const sliderSettings = {
 infinite: true,
 slidesToShow: 1,
 slidesToScroll: 1,
 autoplay: true,
 autoplaySpeed: 3500,
 dots: true,
 arrows: false,
 speed: 600,
 pauseOnHover: false,
};
// ---------- Right side: slider content ----------
const slides = [
 {
  img: "images/auth/slider-image.jpg",
  title: "Crafted Cuisine. Nourishing Intent.",
  subtitle: "We prepare elevated meals with health, care, and flavor.",
 },
 {
  img: "images/auth/slider-image.jpg",
  title: "Crafted Cuisine. Nourishing Intent.",
  subtitle: "We prepare elevated meals with health, care, and flavor.",
 },
 {
  img: "images/auth/slider-image.jpg",
  title: "Crafted Cuisine. Nourishing Intent.",
  subtitle: "We prepare elevated meals with health, care, and flavor.",
 },
];

const PromoSlider = () => {
 return (
  <div className="w-[55%] login-silder h-full md:block hidden">
   <Slider {...sliderSettings}>
    {slides.map((s, idx) => (
     <div key={idx}>
      <div className="relative h-[100vh] xl:h-[100vh] overflow-hidden">
       <img
        src={s.img}
        alt={s.title}
        className="absolute inset-0 h-full w-full object-cover"
       />
       <div className="absolute inset-0 bg-black/30" />
       <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-xl mx-auto text-center px-6">
         <h3 className="text-white text-2xl md:text-3xl font-semibold">
          {s.title}
         </h3>
         <p className="mt-2 text-white/90">{s.subtitle}</p>
        </div>
       </div>
      </div>
     </div>
    ))}
   </Slider>
  </div>

 );
};

export default PromoSlider;
