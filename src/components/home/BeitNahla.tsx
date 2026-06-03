import MobileFooterNav from "./MobileFooterNav";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import BeitNahlaMenu from "../BeitNahla/BeitNahlaMenu";

const BeitNahla = () => {
 return (
  <div className="min-h-screen flex flex-col relative bg-[#FAFAFD]">
   <Header />

   <main className="flex-1 relative flex flex-col">
    <BeitNahlaMenu />
   </main>
   <MobileFooterNav />
   <Footer />
  </div>
 );
};

export default BeitNahla;
