import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
const VendingHeader = () => {
 const path = useLocation();
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

 const toggleMobileMenu = () => {
  setIsMobileMenuOpen(!isMobileMenuOpen);
 };

 return (
  <header className="bg-neutral-white border-b border-neutral-gray-lightest sticky top-0 z-50">
   <div className="main-container mx-auto ">
    <div className="flex items-center justify-between h-16">
     {/* Logo */}
     <Link to="/" className="flex-shrink-0">
      <img
       src={"/images/nav/vending_logo.svg"}
       alt="logo"
       className="h-[20px] w-[180px] sm:h-[24px] sm:w-[241px]"
      />
     </Link>

     {/* Desktop Navigation */}
     <div className="hidden md:flex items-center gap-4 lg:gap-6">
      {/* Language Selector */}
      <select className="text-[14px] lg:text-[16px] leading-[24px] tracking-[0.1px] font-[700] select-none outline-none text-neutral-black cursor-pointer hover:text-primary transition-colors bg-transparent">
       <option value="">En</option>
       <option value="">Ar</option>
       <option value="">Cn</option>
      </select>

      <span className="h-[32px] bg-[#EDEEF2] w-[1px]"></span>

      {/* My Order Link */}
      <Link
       to="/orders"
       className="text-[14px] lg:text-[16px] leading-[24px] tracking-[0.1px] font-[700] text-neutral-black hover:text-primary transition-colors whitespace-nowrap">
       My Order
      </Link>

      {/* Cart Icon with Badge */}
      <button className="relative flex-shrink-0">
       <img
        src="/images/nav/cart.svg"
        alt="cart"
        className="h-[40px] w-[40px] lg:h-[48px] lg:w-[48px]"
       />
      </button>

      {/* User Icon */}
      <button className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] bg-[#054A86] rounded-[12px] lg:rounded-[16px] text-white flex items-center justify-center text-[12px] lg:text-[14px] font-[600] flex-shrink-0">
       NS
      </button>
     </div>

     {/* Mobile Menu Button */}
     <button
      onClick={toggleMobileMenu}
      className="md:hidden p-2 text-neutral-black hover:text-primary transition-colors"
      aria-label="Toggle menu">
      {isMobileMenuOpen ? (
       <X className="h-6 w-6" />
      ) : (
       <Menu className="h-6 w-6" />
      )}
     </button>
    </div>

    {/* Mobile Navigation Menu */}
    {isMobileMenuOpen && (
     <div className="md:hidden border-t border-neutral-gray-lightest py-4">
      <nav className="flex flex-col gap-4">
       {/* Language Selector */}
       <div className="flex items-center justify-between px-2">
        <span className="text-[14px] font-[600] text-neutral-black">
         Language
        </span>
        <select className="text-[14px] leading-[24px] tracking-[0.1px] font-[700] select-none outline-none text-neutral-black cursor-pointer hover:text-primary transition-colors bg-transparent px-2 py-1 border border-neutral-gray-lightest rounded">
         <option value="">En</option>
         <option value="">Ar</option>
         <option value="">Cn</option>
        </select>
       </div>

       <div className="h-[1px] bg-[#EDEEF2]"></div>

       {/* My Order Link */}
       <Link
        to="/orders"
        onClick={toggleMobileMenu}
        className="text-[16px] leading-[24px] tracking-[0.1px] font-[700] text-neutral-black hover:text-primary transition-colors px-2 py-2">
        My Order
       </Link>

       <div className="h-[1px] bg-[#EDEEF2]"></div>

       {/* Cart and User Section */}
       <div className="flex items-center justify-between px-2">
        <button className="relative flex items-center gap-2">
         <img
          src="/images/nav/cart.svg"
          alt="cart"
          className="h-[40px] w-[40px]"
         />
         <span className="text-[14px] font-[600] text-neutral-black">Cart</span>
        </button>

        <button className="w-[40px] h-[40px] bg-[#054A86] rounded-[12px] text-white flex items-center justify-center text-[12px] font-[600]">
         NS
        </button>
       </div>
      </nav>
     </div>
    )}
   </div>
  </header>
 );
};

export default VendingHeader;
