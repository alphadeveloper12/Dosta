import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import PromoBanners from "@/components/home/PromoBanners";
import Newsletter from "@/components/home/Newsletter";
import ShowCase from "@/components/home/ShowCase";
import Companies from "@/components/home/Companies";

const Index = () => {
 return (
  <div className="min-h-screen flex flex-col">
   <Header />

   <main className="flex-1">
    <HeroSection />
    <ShowCase />
    <PromoBanners />
    <Companies />
    <Newsletter />
   </main>

   <Footer />
  </div>
 );
};

export default Index;
