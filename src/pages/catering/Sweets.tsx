import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import MobileFooterNav from "@/components/home/MobileFooterNav";

const Sweets = () => {
 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />

   <main className="flex-1 relative">
    <h1>sweets page</h1>
   </main>
   <MobileFooterNav />
   <Footer />
  </div>
 );
};

export default Sweets;
