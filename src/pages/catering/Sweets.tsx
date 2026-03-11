import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import MobileFooterNav from "@/components/home/MobileFooterNav";
import SweetsMenu from "@/components/Sweets/SweetsMenu";

const Sweets = () => {
 return (
  <div className="min-h-screen flex flex-col relative bg-[#FAFAFD]">
   <Header />

   <main className="flex-1 relative flex flex-col">
    <SweetsMenu />
   </main>
   <MobileFooterNav />
   <Footer />
  </div>
 );
};

export default Sweets;
