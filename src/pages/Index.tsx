import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import PromoBanners from "@/components/home/PromoBanners";
import Newsletter from "@/components/home/Newsletter";
import ShowCase from "@/components/home/ShowCase";
import Companies from "@/components/home/Companies";
import MobileFooterNav from "@/components/home/MobileFooterNav";
import DownloadAppModal from "@/components/common/DownloadAppModal";
import { useState } from "react";

const Index = () => {
 const [downloadOpen, setDownloadOpen] = useState(false);

 return (
  <div className="min-h-screen flex flex-col relative overflow-x-hidden">
   <Header />

   <main className="flex-1 relative overflow-x-hidden">
    <HeroSection onDownloadClick={() => setDownloadOpen(true)} />
    <ShowCase />
    <PromoBanners onDownloadClick={() => setDownloadOpen(true)} />
    <Companies />
    <Newsletter />
   </main>
   <MobileFooterNav />
   <Footer />

   <DownloadAppModal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
  </div>
 );
};

export default Index;
