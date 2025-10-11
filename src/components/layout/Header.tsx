import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

 const toggleMobileMenu = () => {
  setIsMobileMenuOpen(!isMobileMenuOpen);
 };

 return (
  <header className="bg-primary-dark sticky top-0 z-50 ">
   <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[10.313rem]">
    <div className="flex items-center justify-between h-16">
     {/* Logo and side bar links */}
     <div className="flex items-center gap-[40px]">
      <Link to="/" className="flex-shrink-0">
       <img
        src="images/nav/logo.svg"
        alt="logo"
        className="h-[24px] w-[135px] sm:h-[24px] sm:w-[141px]"
       />
      </Link>
      <div className="lg:flex items-center text-neutral-gray-lightest gap-[24px] hidden ">
       <Link
        to={"/"}
        className="text-[16px] leading-[24px] font-[700] tracking-[0.1px]">
        Services
       </Link>
       <Link
        to={"/"}
        className="text-[16px] leading-[24px] font-[700] tracking-[0.1px]">
        Portfolio
       </Link>
       <Link
        to={"/"}
        className="text-[16px] leading-[24px] font-[700] tracking-[0.1px]">
        About us
       </Link>
       <Link
        to={"/"}
        className="text-[16px] leading-[24px] font-[700] tracking-[0.1px]">
        Request a quote
       </Link>
      </div>
     </div>

     {/* Desktop Navigation */}
     <div className="hidden md:flex items-center gap-4 lg:gap-6">
      {/* Language Selector */}
      <select className="text-[14px] lg:text-[16px] leading-[24px] tracking-[0.1px] font-[700] select-none outline-none text-neutral-white cursor-pointer hover:text-primary transition-colors bg-transparent">
       <option value="">En</option>
       <option value="">Ar</option>
       <option value="">Cn</option>
      </select>

      <span className="h-[32px] bg-neutral-gray-light w-[1px]"></span>

      {/* User Icon */}
      <button className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] bg-neutral-gray rounded-[12px] lg:rounded-[16px] text-white flex items-center justify-center text-[12px] lg:text-[14px] font-[600] flex-shrink-0">
       <img src="/images/nav/user.svg" alt="user" />
      </button>
     </div>

     {/* Mobile Menu Button */}
     <button
      onClick={toggleMobileMenu}
      className="md:hidden p-2 text-neutral-white "
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
        <span className="text-[14px] font-[600] text-neutral-white">
         Language
        </span>
        <select className="text-[14px] leading-[24px] tracking-[0.1px] font-[700] select-none outline-none text-neutral-white cursor-pointer bg-transparent px-2 py-1 border border-neutral-gray-lightest rounded">
         <option value="">En</option>
         <option value="">Ar</option>
         <option value="">Cn</option>
        </select>
       </div>

       <div className="h-[1px] bg-[#EDEEF2]"></div>
       <div className="flex flex-col  items-start text-neutral-gray-lightest gap-[24px]">
        <Link
         to={"/"}
         className="text-[16px] leading-[24px] font-[700] tracking-[0.1px]">
         Services
        </Link>
        <Link
         to={"/"}
         className="text-[16px] leading-[24px] font-[700] tracking-[0.1px]">
         Portfolio
        </Link>
        <Link
         to={"/"}
         className="text-[16px] leading-[24px] font-[700] tracking-[0.1px]">
         About us
        </Link>
        <Link
         to={"/"}
         className="text-[16px] leading-[24px] font-[700] tracking-[0.1px]">
         Request a quote
        </Link>
       </div>
       <div className="h-[1px] bg-[#EDEEF2]"></div>

       {/* Cart and User Section */}
       <div className="flex items-center justify-between px-2">
        <button className="relative flex items-center gap-2">
         <img
          src="images/nav/cart.svg"
          alt="cart"
          className="h-[40px] w-[40px]"
         />
         <span className="text-[14px] font-[600] text-neutral-black">Cart</span>
        </button>

        {/* User Icon */}
        <button className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] bg-neutral-gray rounded-[12px] lg:rounded-[16px] text-white flex items-center justify-center text-[12px] lg:text-[14px] font-[600] flex-shrink-0">
         <img src="/images/nav/user.svg" alt="user" />
        </button>
       </div>
      </nav>
     </div>
    )}
   </div>
  </header>
 );
};

export default Header;
